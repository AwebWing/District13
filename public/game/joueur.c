#include "joueur.h"

SDL_Window   *fenetre      = NULL;
SDL_Renderer *rendu        = NULL;
TTF_Font     *policeGrande = NULL;
TTF_Font     *policeMoyenne= NULL;
TTF_Font     *policePetite = NULL;

static void dessinerRect(int x, int y, int l, int h, Couleur c) {
    SDL_SetRenderDrawBlendMode(rendu, c.a<255 ? SDL_BLENDMODE_BLEND : SDL_BLENDMODE_NONE);
    SDL_SetRenderDrawColor(rendu, c.r, c.g, c.b, c.a);
    SDL_Rect r={x,y,l,h};
    SDL_RenderFillRect(rendu, &r);
}

static void dessinerBordure(int x, int y, int l, int h, int ep, Couleur c) {
    SDL_SetRenderDrawBlendMode(rendu, SDL_BLENDMODE_BLEND);
    SDL_SetRenderDrawColor(rendu, c.r, c.g, c.b, c.a);
    SDL_Rect top   ={x,       y,       l,  ep};
    SDL_Rect bot   ={x,       y+h-ep,  l,  ep};
    SDL_Rect left  ={x,       y,       ep, h };
    SDL_Rect right ={x+l-ep,  y,       ep, h };
    SDL_RenderFillRect(rendu, &top);
    SDL_RenderFillRect(rendu, &bot);
    SDL_RenderFillRect(rendu, &left);
    SDL_RenderFillRect(rendu, &right);
}

static void dessinerLigne(int x1, int y1, int x2, int y2, Couleur c) {
    SDL_SetRenderDrawBlendMode(rendu, SDL_BLENDMODE_BLEND);
    SDL_SetRenderDrawColor(rendu, c.r, c.g, c.b, c.a);
    SDL_RenderDrawLine(rendu, x1, y1, x2, y2);
}

static void dessinerTexteAvec(TTF_Font *font, const char *txt, int x, int y, Couleur c) {
    if (!txt || !txt[0] || !font) return;
    SDL_Color sc = {c.r, c.g, c.b, c.a};
    SDL_Surface *surf = TTF_RenderUTF8_Blended(font, txt, sc);
    if (!surf) return;
    SDL_Texture *tex = SDL_CreateTextureFromSurface(rendu, surf);
    SDL_Rect dst = {x, y, surf->w, surf->h};
    SDL_FreeSurface(surf);
    if (!tex) return;
    SDL_RenderCopy(rendu, tex, NULL, &dst);
    SDL_DestroyTexture(tex);
}

static int largeurTexteAvec(TTF_Font *font, const char *t) {
    if (!font || !t) return (int)strlen(t)*10;
    int w=0, h=0;
    TTF_SizeUTF8(font, t, &w, &h);
    return w;
}

static void dessinerTexteCentre(TTF_Font *font, const char *txt, int cx, int y, Couleur c) {
    int w = largeurTexteAvec(font, txt);
    dessinerTexteAvec(font, txt, cx - w/2, y, c);
}

static SDL_Texture *chargerSprite(const char *chemin) {
    SDL_Surface *s = IMG_Load(chemin);
    if (!s) return NULL;
    SDL_Texture *t = SDL_CreateTextureFromSurface(rendu, s);
    SDL_FreeSurface(s);
    return t;
}

static void chargerSprites(Joueur *j) {
    const char *nomsPerso[2] = {"katniss","peeta"};
    const char *nomsAnim[5]  = {"walk","run","jump","attaque","death"};
    char ch[256];
    int i;
    for (i=0; i<5; i++) {
        snprintf(ch, sizeof(ch), "assets/%s_%s.png",
                 nomsPerso[j->personnage], nomsAnim[i]);
        j->spriteSheets[i] = chargerSprite(ch);
    }
}

void initialiserJoueur(Joueur *j, ConfigJoueur cfg, float startX) {
    j->rect.x       = startX;
    j->rect.y       = SOL_Y;
    j->rect.largeur = (float)JOUEUR_W;
    j->rect.hauteur = (float)JOUEUR_HAUTEUR;
    j->velY         = 0.0f;
    j->pv = j->pvMax= 100;
    j->kills=j->deaths=j->score=0;
    j->vitesse      = VITESSE_BASE;
    j->enSaut=j->vivant=1; j->vivant=1; j->enSaut=0;
    j->orientationDroite=1;
    j->animCourante = ANIM_MARCHE;
    j->frameAnim    = 0.0f;
    j->tenue        = cfg.tenue;
    j->personnage   = cfg.personnage;
    j->config       = cfg;
    j->offsetX      = 0;
    j->zoneW        = SCREEN_W;
    strncpy(j->nom, (cfg.personnage==PERSO_KATNISS)?"Katniss":"Peeta", 19);
    j->nom[19]='\0';
    chargerSprites(j);
}

void initialiserJoueur2(Joueur *j, ConfigJoueur cfg, float startX) {
    initialiserJoueur(j, cfg, startX);
}

void animerJoueur(Joueur *j, float dt) {
    if (!j->vivant)    j->animCourante = ANIM_MORT;
    else if (j->enSaut) j->animCourante = ANIM_SAUT;
    j->frameAnim += ANIM_SPEED * 60.0f * dt;
    if (j->frameAnim >= (float)FRAME_COUNT) j->frameAnim = 0.0f;
}

void deplacerJoueur(Joueur *j, SDL_Scancode *clavier) {
    if (!j->vivant) return;
    const Uint8 *etat = SDL_GetKeyboardState(NULL);
    int mv=0;
    if (etat[j->config.toucheGauche])  { j->rect.x -= j->vitesse; j->orientationDroite=0; mv=1; }
    if (etat[j->config.toucheDroite])  { j->rect.x += j->vitesse; j->orientationDroite=1; mv=1; }
    if (etat[j->config.toucheSaut] && !j->enSaut) { j->velY=FORCE_SAUT; j->enSaut=1; }
    if (etat[j->config.toucheAttaque]) j->animCourante=ANIM_ATTAQUE;
    else if (!j->enSaut)               j->animCourante=mv ? ANIM_COURSE : ANIM_MARCHE;
    j->velY += GRAVITE;
    j->rect.y += j->velY;
    if (j->rect.y >= SOL_Y) { j->rect.y=SOL_Y; j->velY=0.0f; j->enSaut=0; }
    float lg=(float)j->offsetX, ld=(float)(j->offsetX+j->zoneW)-j->rect.largeur;
    if (j->rect.x < lg) j->rect.x=lg;
    if (j->rect.x > ld) j->rect.x=ld;
    (void)clavier;
}

void afficherJoueur(Joueur *j) {
    int frame=(int)j->frameAnim % FRAME_COUNT;
    SDL_Texture *sheet=j->spriteSheets[j->animCourante];
    int px=(int)j->rect.x, py=(int)j->rect.y;
    int pw=(int)j->rect.largeur, ph=(int)j->rect.hauteur;
    if (sheet) {
        int tw, th;
        SDL_QueryTexture(sheet,NULL,NULL,&tw,&th);
        int fw=tw/5, fh=th/5;
        SDL_Rect src={(frame%5)*fw,(frame/5)*fh,fw,fh};
        SDL_Rect dst={px,py,pw,ph};
        SDL_RendererFlip flip=j->orientationDroite?SDL_FLIP_NONE:SDL_FLIP_HORIZONTAL;
        SDL_RenderCopyEx(rendu,sheet,&src,&dst,0.0,NULL,flip);
    } else {
        Couleur col=(j->personnage==PERSO_KATNISS)?(Couleur){220,60,60,255}:(Couleur){60,120,220,255};
        dessinerRect(px,py,pw,ph,col);
        dessinerRect(px+pw/4,py-20,pw/2,18,(Couleur){255,210,160,255});
    }
    dessinerRect(px,py-10,pw,6,(Couleur){80,0,0,255});
    int rempli=(j->pvMax>0)?(j->pv*pw/j->pvMax):0;
    dessinerRect(px,py-10,rempli,6,(Couleur){0,200,50,255});
    dessinerTexteAvec(policePetite,j->nom,px,py-26,BLANC);
}

/* ── Helpers visuels style hologramme ─────────────────────────────────── */

static void dessinerCarteHolo(int x, int y, int w, int h,
                               Couleur couleurBord, Couleur couleurFond,
                               int selectionne, float timer) {
    float pulse = 0.6f + 0.4f * (float)sin((double)timer * 3.0);
    Couleur fondInt = couleurFond;
    fondInt.a = (unsigned char)(fondInt.a * pulse);
    dessinerRect(x, y, w, h, fondInt);
    int ep = selectionne ? 3 : 1;
    Couleur bord = couleurBord;
    bord.a = selectionne ? 255 : (unsigned char)(120 * pulse);
    dessinerBordure(x, y, w, h, ep, bord);
    if (selectionne) {
        Couleur lueur = couleurBord;
        lueur.a = (unsigned char)(60 * pulse);
        dessinerBordure(x-4, y-4, w+8, h+8, 2, lueur);
        dessinerBordure(x-8, y-8, w+16, h+16, 1, lueur);
    }
}

static void dessinerSeparateurOr(int cx, int y, int largeur) {
    int x1 = cx - largeur/2;
    int x2 = cx + largeur/2;
    dessinerLigne(x1, y, x2, y, OR);
    dessinerRect(cx - 4, y - 3, 8, 6, OR);
    dessinerRect(x1, y - 1, 20, 2, OR_SOMBRE);
    dessinerRect(x2 - 20, y - 1, 20, 2, OR_SOMBRE);
}

static void dessinerFleche(int cx, int cy, int dir, int sel) {
    Couleur c = sel ? OR : GRIS_M;
    int taille = 12;
    int i;
    for (i = 0; i < taille; i++) {
        int dx = (dir > 0) ? i : (taille - 1 - i);
        int hauteur = i + 1;
        dessinerRect(cx + dx*dir - (dir<0?taille:0),
                     cy - hauteur/2, 2, hauteur, c);
    }
}

/* ── Etape 0 : choix du mode ────────────────────────────────────────────── */

static void etapeMode(EtatMenu *em) {
    int cx = SCREEN_W/2;

    dessinerTexteCentre(policeGrande, "DISTRICT 13", cx, 60, OR);
    dessinerSeparateurOr(cx, 120, 400);
    dessinerTexteCentre(policeMoyenne, "Choisissez votre défi", cx, 138, GRIS_CL);

    const char *labels[2] = {"Monojoueur", "Multijoueur"};
    const char *soustitres[2] = {"Un seul tribut entre dans l'arene",
                                 "Deux tributs, un seul vainqueur"};
    int bw=420, bh=100, by=240, ecart=30;
    int bx = cx - bw/2;
    int i;
    for (i=0; i<2; i++) {
        int y = by + i*(bh+ecart);
        Couleur bord = (em->selectionMode==i) ? OR : GRIS_M;
        Couleur fond = (em->selectionMode==i) ?
            (Couleur){80,60,10,160} : (Couleur){20,20,40,130};
        dessinerCarteHolo(bx, y, bw, bh, bord, fond, em->selectionMode==i, em->animTimer);
        Couleur tc = (em->selectionMode==i) ? OR : GRIS_CL;
        dessinerTexteCentre(policeMoyenne, labels[i], cx, y+22, tc);
        dessinerTexteCentre(policePetite,  soustitres[i], cx, y+58, GRIS_M);
    }

    dessinerSeparateurOr(cx, 610, 500);
    dessinerTexteCentre(policePetite, "UTILISE LES FLECHES    |    ENTREE POUR VALIDER",
                        cx, 625, GRIS_M);
}

/* ── Etape 1 & 4 : choix du personnage ─────────────────────────────────── */

static void etapePersonnage(EtatMenu *em, int numJ) {
    int cx = SCREEN_W/2;
    int sel = (numJ==1) ? em->selectionPersoJ1 : em->selectionPersoJ2;
    int estJ2 = (numJ==2);

    char titre[64];
    snprintf(titre, sizeof(titre), "Tribut %d:Un seul survivra...Choisissez votre combattant", numJ);
    dessinerTexteCentre(policeGrande, titre, cx, 38, OR);
    const char *sousTitre = estJ2
        ? "Le personnage oppose vous a ete assigne automatiquement."
        : "Que la chance soit toujours en votre faveur.";
    dessinerTexteCentre(policePetite, sousTitre, cx, 92, GRIS_M);
    dessinerSeparateurOr(cx, 118, 500);

    const char *noms[2]      = {"KATNISS", "PEETA"};
    const char *slogans[2]   = {"L'ARC  -  LA SURVIE", "LA FORCE  -  LA LOYAUTE"};
    Couleur bordCarte[2]     = {ORANGE_FEU, BLEU_CIEL};
    Couleur fondCarte[2]     = {ORANGE_HOLO, BLEU_HOLO};

    int cw=240, ch=380, cy=155, ecart=80;
    int totalW = 2*cw + ecart;
    int startX = cx - totalW/2;
    int i;

    for (i=0; i<2; i++) {
        int x = startX + i*(cw+ecart);
        int estSel = (sel==i);
        int estBloque = estJ2 && !estSel;

        Couleur bord = estBloque ? (Couleur){80,80,80,100} : bordCarte[i];
        Couleur fond = estBloque ? (Couleur){20,20,30,80}  : fondCarte[i];
        dessinerCarteHolo(x, cy, cw, ch, bord, fond, estSel, em->animTimer);

        if (em->imgPerso[i]) {
            int marge = estSel ? 8 : 14;
            SDL_SetTextureAlphaMod(em->imgPerso[i], estBloque ? 60 : 255);
            SDL_Rect dst = {x+marge, cy+marge, cw-marge*2, ch-90};
            SDL_RenderCopy(rendu, em->imgPerso[i], NULL, &dst);
            SDL_SetTextureAlphaMod(em->imgPerso[i], 255);
        } else {
            Couleur fc = (i==0) ? (Couleur){180,60,20,200} : (Couleur){30,80,180,200};
            if (estBloque) fc.a = 60;
            dessinerRect(x+10, cy+10, cw-20, ch-90, fc);
            dessinerTexteCentre(policeMoyenne, noms[i], x+cw/2, cy+ch/2-80, BLANC);
        }

        if (estBloque) {
            dessinerRect(x, cy, cw, ch, (Couleur){0,0,0,120});
            dessinerTexteCentre(policePetite, "PRIS", x+cw/2, cy+ch/2-10, (Couleur){180,60,60,255});
        }

        int baseY = cy + ch - 82;
        dessinerLigne(x+10, baseY, x+cw-10, baseY, bord);
        Couleur nc = estSel ? OR : (estBloque ? GRIS_M : BLANC);
        dessinerTexteCentre(policeMoyenne, noms[i], x+cw/2, baseY+8, nc);
        dessinerTexteCentre(policePetite, slogans[i], x+cw/2, baseY+38,
                            estBloque ? (Couleur){80,80,80,200} : GRIS_M);
    }

    dessinerSeparateurOr(cx, 614, 500);
    const char *hint = estJ2
        ? "ENTREE POUR CONFIRMER VOTRE TRIBUT"
        : "UTILISE LES FLECHES  < >  POUR CHOISIR TON TRIBUT";
    dessinerTexteCentre(policePetite, hint, cx, 628, GRIS_M);
}

/* ── Etape 2 & 5 : choix de la tenue ────────────────────────────────────── */

static void etapeTenue(EtatMenu *em, int numJ) {
    int cx = SCREEN_W/2;
    int selPerso = (numJ==1) ? em->selectionPersoJ1 : em->selectionPersoJ2;
    int selTenue = (numJ==1) ? em->selectionTenueJ1 : em->selectionTenueJ2;
    const char *nomPerso = (selPerso==PERSO_KATNISS) ? "KATNISS" : "PEETA";
    Couleur coulBord = (selPerso==PERSO_KATNISS) ? ORANGE_FEU : BLEU_CIEL;

    char titre[64];
    snprintf(titre, sizeof(titre), "Tribut %d: Équipez-vous pour survivre :%s", numJ, nomPerso);
    dessinerTexteCentre(policeGrande, titre, cx, 38, OR);
    dessinerTexteCentre(policePetite, "Choisissez l'apparence de votre tribut", cx, 92, GRIS_M);
    dessinerSeparateurOr(cx, 118, 500);

    const char *labels[3]     = {"CEREMONIE", "COMBAT", "ARENA"};
    const char *descriptions[3] = {"Elegance & prestige",
                                    "Armure & resistance",
                                    "Survie & discretion"};
    int tw=230, th=310, ty=145, ecart=35;
    int totalW = 3*tw + 2*ecart;
    int startX = cx - totalW/2;
    int i;

    for (i=0; i<3; i++) {
        int x = startX + i*(tw+ecart);
        int estSel = (selTenue==i);
        Couleur fond = estSel ?
            (selPerso==PERSO_KATNISS ? ORANGE_HOLO : BLEU_HOLO) :
            (Couleur){15,15,35,130};
        dessinerCarteHolo(x, ty, tw, th, coulBord, fond, estSel, em->animTimer);
        if (em->imgTenues[selPerso][i]) {
            int marge = estSel ? 6 : 12;
            SDL_Rect dst = {x+marge, ty+marge, tw-marge*2, th-80};
            SDL_RenderCopy(rendu, em->imgTenues[selPerso][i], NULL, &dst);
        } else {
            Couleur fc = {40,40,70,200};
            dessinerRect(x+10, ty+10, tw-20, th-80, fc);
            dessinerTexteCentre(policePetite, "?", x+tw/2, ty+th/2-60, GRIS_M);
        }
        int baseY = ty + th - 72;
        dessinerLigne(x+8, baseY, x+tw-8, baseY, coulBord);
        Couleur lc = estSel ? OR : GRIS_CL;
        dessinerTexteCentre(policeMoyenne, labels[i], x+tw/2, baseY+8, lc);
        dessinerTexteCentre(policePetite, descriptions[i], x+tw/2, baseY+36, GRIS_M);
    }

    dessinerSeparateurOr(cx, 614, 500);
    dessinerTexteCentre(policePetite,
        "FLECHES  < >  POUR NAVIGUER    |    ENTREE POUR VALIDER",
        cx, 628, GRIS_M);
}

/* ── Etape 3 & 6 : choix des inputs ─────────────────────────────────────── */

static void etapeInput(EtatMenu *em, int numJ) {
    int cx = SCREEN_W/2;
    int sel = (numJ==1) ? em->selectionInputJ1 : em->selectionInputJ2;
    int estJ2 = (numJ==2);

    char titre[64];
    snprintf(titre, sizeof(titre), "Tribut %d  -  Configure tes commandes de survie", numJ);
    dessinerTexteCentre(policeGrande, titre, cx, 38, OR);
    const char *sousTitre = estJ2
        ? "La configuration opposee vous a ete assignee automatiquement."
        : "Configurez les commandes de votre tribut";
    dessinerTexteCentre(policePetite, sousTitre, cx, 92, GRIS_M);
    dessinerSeparateurOr(cx, 118, 500);

    const char *configNoms[2]  = {"Choix 1", "Choix 2"};
    const char *configMvt[2]   = {"Z / Q / D", "FLECHES"};
    const char *configAtk[2]   = {"E  (attaque)", "CTRL DROIT  (attaque)"};
    const char *configSaut[2]  = {"Z  (saut)", "FLECHE HAUT  (saut)"};

    int bw=340, bh=260, by=175, ecart=60;
    int totalW = 2*bw + ecart;
    int bx0 = cx - totalW/2;
    int i;

    for (i=0; i<2; i++) {
        int x = bx0 + i*(bw+ecart);
        int estSel    = (sel==i);
        int estBloque = estJ2 && !estSel;

        Couleur bord = estBloque ? (Couleur){80,80,80,80}   : (estSel ? OR : GRIS_M);
        Couleur fond = estBloque ? (Couleur){15,15,25,80}   : (estSel ? (Couleur){70,55,10,160} : (Couleur){20,20,40,130});
        dessinerCarteHolo(x, by, bw, bh, bord, fond, estSel, em->animTimer);

        Couleur tc   = estBloque ? (Couleur){80,80,80,180}  : (estSel ? OR : GRIS_CL);
        Couleur txtc = estBloque ? (Couleur){80,80,80,160}  : BLANC;
        Couleur libc = estBloque ? (Couleur){70,70,70,140}  : GRIS_M;

        dessinerTexteCentre(policeMoyenne, configNoms[i], x+bw/2, by+20, tc);
        dessinerLigne(x+20, by+58, x+bw-20, by+58, bord);

        int ky = by + 75;
        dessinerTexteAvec(policePetite, "Deplacement :", x+20, ky,     libc);
        dessinerTexteAvec(policePetite, configMvt[i],   x+20, ky+24,  txtc);
        dessinerTexteAvec(policePetite, "Saut :",        x+20, ky+60,  libc);
        dessinerTexteAvec(policePetite, configSaut[i],  x+20, ky+84,  txtc);
        dessinerTexteAvec(policePetite, "Attaque :",     x+20, ky+120, libc);
        dessinerTexteAvec(policePetite, configAtk[i],   x+20, ky+144, txtc);

        if (estBloque) {
            dessinerRect(x, by, bw, bh, (Couleur){0,0,0,100});
            dessinerTexteCentre(policePetite, "PRIS", x+bw/2, by+bh/2-10, (Couleur){180,60,60,255});
        }
        if (estSel && !estJ2) {
            dessinerFleche(x - 28, by + bh/2, -1, 1);
            dessinerFleche(x + bw + 28, by + bh/2, 1, 1);
        }
    }

    dessinerSeparateurOr(cx, 614, 500);
    const char *hintInput = estJ2
        ? "ENTREE POUR CONFIRMER"
        : "FLECHES  < >  POUR NAVIGUER    |    ENTREE POUR VALIDER";
    dessinerTexteCentre(policePetite, hintInput, cx, 628, GRIS_M);
}

/* ── afficherMenuJoueur ─────────────────────────────────────────────────── */

void afficherMenuJoueur(EtatMenu *em) {
    if (em->imgBackground) {
        SDL_Rect dst = {0, 0, SCREEN_W, SCREEN_H};
        SDL_RenderCopy(rendu, em->imgBackground, NULL, &dst);
        dessinerRect(0, 0, SCREEN_W, SCREEN_H, NOIR_SEMI);
    } else {
        dessinerRect(0, 0, SCREEN_W, SCREEN_H, (Couleur){8,8,20,255});
        int i;
        for (i=0; i<80; i++) {
            int ex=(i*137+50)%SCREEN_W, ey=(i*79+30)%SCREEN_H;
            dessinerRect(ex, ey, 2, 2, (Couleur){255,255,255,60});
        }
    }

    switch (em->etape) {
        case ETAPE_MODE:     etapeMode(em);          break;
        case ETAPE_PERSO_J1: etapePersonnage(em, 1); break;
        case ETAPE_TENUE_J1: etapeTenue(em, 1);      break;
        case ETAPE_INPUT_J1: etapeInput(em, 1);       break;
        case ETAPE_PERSO_J2: etapePersonnage(em, 2); break;
        case ETAPE_TENUE_J2: etapeTenue(em, 2);      break;
        case ETAPE_INPUT_J2: etapeInput(em, 2);       break;
        default: break;
    }
}
