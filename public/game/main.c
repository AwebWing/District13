#include "joueur.h"
#include <time.h>
#include <stdlib.h>

SDL_Texture *chargerImage(const char *chemin) {
    SDL_Surface *s = IMG_Load(chemin);
    if (!s) return NULL;
    SDL_Texture *t = SDL_CreateTextureFromSurface(rendu, s);
    SDL_FreeSurface(s);
    return t;
}

static void chargerAssetsMenu(EtatMenu *em) {
    const char *nomsPerso[2]  = {"katniss","peeta"};
    const char *nomsTenues[3] = {"ceremonie","combat","arena"};
    char ch[256];
    int p, t;
    for (p=0; p<2; p++) {
        snprintf(ch, sizeof(ch), "assets/%s_portrait.png", nomsPerso[p]);
        em->imgPerso[p] = chargerImage(ch);
        for (t=0; t<3; t++) {
            snprintf(ch, sizeof(ch), "assets/%s_%s.png", nomsPerso[p], nomsTenues[t]);
            em->imgTenues[p][t] = chargerImage(ch);
        }
    }
    em->imgBackground = chargerImage("assets/menu_background.png");
    em->imgLogo       = chargerImage("assets/logo.png");
    em->musique       = Mix_LoadMUS("assets/musique_menu.mp3");
    if (!em->musique)
        em->musique   = Mix_LoadMUS("assets/musique_menu.ogg");
    if (em->musique) Mix_PlayMusic(em->musique, -1);
}

static void libererAssetsMenu(EtatMenu *em) {
    int i, j;
    Mix_HaltMusic();
    if (em->musique)       Mix_FreeMusic(em->musique);
    if (em->imgBackground) SDL_DestroyTexture(em->imgBackground);
    if (em->imgLogo)       SDL_DestroyTexture(em->imgLogo);
    for (i=0; i<2; i++) {
        if (em->imgPerso[i]) SDL_DestroyTexture(em->imgPerso[i]);
        for (j=0; j<3; j++)
            if (em->imgTenues[i][j]) SDL_DestroyTexture(em->imgTenues[i][j]);
    }
}

static ConfigJoueur construireConfig(EtatMenu *em, int numJ) {
    ConfigJoueur cfg;
    int selPerso = (numJ==1) ? em->selectionPersoJ1 : em->selectionPersoJ2;
    int selTenue = (numJ==1) ? em->selectionTenueJ1 : em->selectionTenueJ2;
    int selInput = (numJ==1) ? em->selectionInputJ1 : em->selectionInputJ2;
    cfg.personnage = (selPerso==0) ? PERSO_KATNISS : PERSO_PEETA;
    cfg.tenue      = (TypeTenue)selTenue;
    if (selInput==0) {
        cfg.toucheGauche =SDL_SCANCODE_Q;
        cfg.toucheDroite =SDL_SCANCODE_D;
        cfg.toucheSaut   =SDL_SCANCODE_Z;
        cfg.toucheAttaque=SDL_SCANCODE_E;
    } else {
        cfg.toucheGauche =SDL_SCANCODE_LEFT;
        cfg.toucheDroite =SDL_SCANCODE_RIGHT;
        cfg.toucheSaut   =SDL_SCANCODE_UP;
        cfg.toucheAttaque=SDL_SCANCODE_RCTRL;
    }
    return cfg;
}

static void gererMenu(EtatMenu *em, const Uint8 *press) {
    int haut   = press[SDL_SCANCODE_UP];
    int bas    = press[SDL_SCANCODE_DOWN];
    int gauche = press[SDL_SCANCODE_LEFT];
    int droite = press[SDL_SCANCODE_RIGHT];
    int entree = press[SDL_SCANCODE_RETURN];

    switch (em->etape) {
        case ETAPE_MODE:
            if (haut||bas) em->selectionMode=(em->selectionMode+1)%2;
            if (entree)    em->etape=ETAPE_PERSO_J1;
            break;
        case ETAPE_PERSO_J1:
            if (gauche||droite) em->selectionPersoJ1=(em->selectionPersoJ1+1)%2;
            if (entree)         em->etape=ETAPE_TENUE_J1;
            break;
        case ETAPE_TENUE_J1:
            if (gauche) em->selectionTenueJ1=(em->selectionTenueJ1+2)%3;
            if (droite) em->selectionTenueJ1=(em->selectionTenueJ1+1)%3;
            if (entree) em->etape=ETAPE_INPUT_J1;
            break;
        case ETAPE_INPUT_J1:
            if (gauche||droite) em->selectionInputJ1=(em->selectionInputJ1+1)%2;
            if (entree) {
                if (em->selectionMode==MODE_DUO) {
                    em->selectionPersoJ2 = (em->selectionPersoJ1==0) ? 1 : 0;
                    em->selectionInputJ2 = (em->selectionInputJ1==0) ? 1 : 0;
                    em->etape = ETAPE_PERSO_J2;
                } else {
                    em->etape = ETAPE_TERMINE;
                }
            }
            break;
        case ETAPE_PERSO_J2:
            if (entree) em->etape=ETAPE_TENUE_J2;
            break;
        case ETAPE_TENUE_J2:
            if (gauche) em->selectionTenueJ2=(em->selectionTenueJ2+2)%3;
            if (droite) em->selectionTenueJ2=(em->selectionTenueJ2+1)%3;
            if (entree) em->etape=ETAPE_INPUT_J2;
            break;
        case ETAPE_INPUT_J2:
            if (entree) em->etape=ETAPE_TERMINE;
            break;
        default: break;
    }
}

static void lancerJeu(EtatMenu *em, Joueur *joueurs, int *nbJoueurs) {
    Mix_HaltMusic();
    em->configJ1 = construireConfig(em, 1);
    initialiserJoueur(&joueurs[0], em->configJ1, 200.0f);
    joueurs[0].offsetX=0; joueurs[0].zoneW=SCREEN_W;
    *nbJoueurs=1;
    if (em->selectionMode==MODE_DUO) {
        em->configJ2=construireConfig(em, 2);
        initialiserJoueur2(&joueurs[1], em->configJ2, (float)(SCREEN_W/2+200));
        joueurs[0].offsetX=0;         joueurs[0].zoneW=SCREEN_W/2;
        joueurs[0].rect.x=150.0f;
        joueurs[1].offsetX=SCREEN_W/2; joueurs[1].zoneW=SCREEN_W/2;
        joueurs[1].rect.x=(float)(SCREEN_W/2+150);
        *nbJoueurs=2;
    }
}

static void afficherJeu(Joueur *joueurs, int nbJoueurs) {
    int i;
    if (nbJoueurs==2) {
        int half=SCREEN_W/2;
        SDL_Rect zG={0,0,half,SCREEN_H}, zD={half,0,half,SCREEN_H};

        SDL_RenderSetClipRect(rendu, &zG);
        SDL_SetRenderDrawColor(rendu,40,70,40,255);
        SDL_Rect sG={0,590,half,130}; SDL_RenderFillRect(rendu,&sG);
        afficherJoueur(&joueurs[0]);

        SDL_RenderSetClipRect(rendu, &zD);
        SDL_SetRenderDrawColor(rendu,40,70,40,255);
        SDL_Rect sD={half,590,half,130}; SDL_RenderFillRect(rendu,&sD);
        afficherJoueur(&joueurs[1]);

        SDL_RenderSetClipRect(rendu, NULL);
        SDL_SetRenderDrawColor(rendu,200,180,50,255);
        SDL_RenderDrawLine(rendu,half,0,half,SCREEN_H);
    } else {
        SDL_SetRenderDrawColor(rendu,40,70,40,255);
        SDL_Rect sol={0,590,SCREEN_W,130}; SDL_RenderFillRect(rendu,&sol);
        for (i=0; i<nbJoueurs; i++) afficherJoueur(&joueurs[i]);
    }
}

static TTF_Font *ouvrirPolice(const char *chemin, int taille) {
    TTF_Font *f = TTF_OpenFont(chemin, taille);
    return f;
}

static void chargerPolices(void) {
    const char *candidates[] = {
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "assets/font.ttf", NULL
    };
    int i;
    for (i=0; candidates[i] && !policeGrande; i++)
        policeGrande  = ouvrirPolice(candidates[i], 38);
    for (i=0; candidates[i] && !policeMoyenne; i++)
        policeMoyenne = ouvrirPolice(candidates[i], 24);
    for (i=0; candidates[i] && !policePetite; i++)
        policePetite  = ouvrirPolice(candidates[i], 17);
}

int main(void) {
    srand((unsigned int)time(NULL));

    if (SDL_Init(SDL_INIT_VIDEO|SDL_INIT_AUDIO)<0) {
        fprintf(stderr,"SDL: %s\n",SDL_GetError()); return 1;
    }
    if (TTF_Init()<0) {
        fprintf(stderr,"TTF: %s\n",TTF_GetError()); SDL_Quit(); return 1;
    }
    if (!(IMG_Init(IMG_INIT_PNG)&IMG_INIT_PNG)) {
        fprintf(stderr,"IMG: %s\n",IMG_GetError()); TTF_Quit(); SDL_Quit(); return 1;
    }
    if (Mix_OpenAudio(44100,MIX_DEFAULT_FORMAT,2,2048)<0)
        fprintf(stderr,"Mix: %s\n",Mix_GetError());
    Mix_VolumeMusic(80);

    fenetre = SDL_CreateWindow("Hunger Games - Lot 1 Joueur",
        SDL_WINDOWPOS_CENTERED,SDL_WINDOWPOS_CENTERED,
        SCREEN_W,SCREEN_H,SDL_WINDOW_SHOWN);
    rendu = SDL_CreateRenderer(fenetre,-1,SDL_RENDERER_ACCELERATED);
    SDL_SetRenderDrawBlendMode(rendu, SDL_BLENDMODE_BLEND);

    chargerPolices();

    EtatMenu em;
    memset(&em, 0, sizeof(em));
    em.selectionPersoJ2 = 1;
    em.etape = ETAPE_MODE;
    chargerAssetsMenu(&em);

    Joueur joueurs[2];
    memset(joueurs, 0, sizeof(joueurs));
    int dansMenu=1, nbJoueurs=1, quitter=0;

    Uint8 press[SDL_NUM_SCANCODES];
    Uint32 dernierTick = SDL_GetTicks();
    float dt=0.0f;

    while (!quitter) {
        Uint32 now = SDL_GetTicks();
        dt = (float)(now - dernierTick)/1000.0f;
        dernierTick = now;
        if (dt>0.05f) dt=0.05f;
        em.animTimer += dt;

        memset(press, 0, sizeof(press));
        SDL_Event ev;
        while (SDL_PollEvent(&ev)) {
            if (ev.type==SDL_QUIT) { quitter=1; }
            else if (ev.type==SDL_KEYDOWN) {
                if (ev.key.keysym.scancode==SDL_SCANCODE_ESCAPE) {
                    if (!dansMenu) {
                        dansMenu=1; em.etape=ETAPE_MODE;
                        if (em.musique) Mix_PlayMusic(em.musique,-1);
                    } else quitter=1;
                } else {
                    press[ev.key.keysym.scancode]=1;
                }
            }
        }

        SDL_SetRenderDrawColor(rendu,8,8,20,255);
        SDL_RenderClear(rendu);

        if (dansMenu) {
            gererMenu(&em, press);
            if (em.etape==ETAPE_TERMINE) {
                lancerJeu(&em, joueurs, &nbJoueurs);
                dansMenu=0;
                em.etape=ETAPE_MODE;
            } else {
                afficherMenuJoueur(&em);
            }
        } else {
            int i;
            for (i=0; i<nbJoueurs; i++) {
                deplacerJoueur(&joueurs[i], NULL);
                animerJoueur(&joueurs[i], dt);
            }
            afficherJeu(joueurs, nbJoueurs);
        }

        SDL_RenderPresent(rendu);
        SDL_Delay(16);
    }

    libererAssetsMenu(&em);
    int s, a;
    for (s=0; s<2; s++)
        for (a=0; a<5; a++)
            if (joueurs[s].spriteSheets[a])
                SDL_DestroyTexture(joueurs[s].spriteSheets[a]);
    if (policeGrande)  TTF_CloseFont(policeGrande);
    if (policeMoyenne) TTF_CloseFont(policeMoyenne);
    if (policePetite)  TTF_CloseFont(policePetite);
    SDL_DestroyRenderer(rendu);
    SDL_DestroyWindow(fenetre);
    Mix_CloseAudio();
    IMG_Quit(); TTF_Quit(); SDL_Quit();
    return 0;
}
