#ifndef JOUEUR_LOT1_H
#define JOUEUR_LOT1_H

#include <SDL2/SDL.h>
#include <SDL2/SDL_image.h>
#include <SDL2/SDL_ttf.h>
#include <SDL2/SDL_mixer.h>
#include <stdio.h>
#include <string.h>
#include <math.h>

#define SCREEN_W       1280
#define SCREEN_H        720
#define FRAME_COUNT      25
#define ANIM_SPEED      0.07f
#define JOUEUR_W         100
#define JOUEUR_HAUTEUR   120
#define VITESSE_BASE     4.0f
#define GRAVITE          0.6f
#define FORCE_SAUT     (-14.0f)
#define SOL_Y           470.0f

typedef struct { unsigned char r, g, b, a; } Couleur;
#define BLANC        ((Couleur){255,255,255,255})
#define NOIR         ((Couleur){  0,  0,  0,255})
#define JAUNE        ((Couleur){253,249,  0,255})
#define OR           ((Couleur){255,200, 50,255})
#define OR_SOMBRE    ((Couleur){180,130, 20,200})
#define BLEU_CIEL    ((Couleur){102,191,255,255})
#define BLEU_HOLO    ((Couleur){ 60,160,255, 80})
#define ORANGE_FEU   ((Couleur){255,120, 20,255})
#define ORANGE_HOLO  ((Couleur){255,140, 30, 80})
#define GRIS_CL      ((Couleur){200,200,200,255})
#define GRIS_M       ((Couleur){140,140,140,255})
#define TRANSPARENT  ((Couleur){  0,  0,  0,  0})
#define NOIR_SEMI    ((Couleur){  0,  0,  0,170})

typedef enum { ANIM_MARCHE=0, ANIM_COURSE, ANIM_SAUT, ANIM_ATTAQUE, ANIM_MORT } TypeAnimation;
typedef enum { TENUE_CEREMONIE=0, TENUE_COMBAT, TENUE_ARENA }                   TypeTenue;
typedef enum { PERSO_KATNISS=0, PERSO_PEETA }                                   TypePersonnage;
typedef enum { MODE_SOLO=0, MODE_DUO }                                           TypeMode;

typedef enum {
    ETAPE_MODE = 0,
    ETAPE_PERSO_J1,
    ETAPE_TENUE_J1,
    ETAPE_INPUT_J1,
    ETAPE_PERSO_J2,
    ETAPE_TENUE_J2,
    ETAPE_INPUT_J2,
    ETAPE_TERMINE
} EtapeMenu;

typedef struct { float x, y, largeur, hauteur; } Rectangle;

typedef struct {
    TypePersonnage personnage;
    TypeTenue      tenue;
    int            toucheGauche;
    int            toucheDroite;
    int            toucheSaut;
    int            toucheAttaque;
} ConfigJoueur;

typedef struct {
    Rectangle      rect;
    float          velY;
    int            pv, pvMax;
    int            kills, deaths, score;
    float          vitesse;
    int            enSaut;
    int            vivant;
    int            orientationDroite;
    char           nom[20];
    TypeAnimation  animCourante;
    float          frameAnim;
    TypeTenue      tenue;
    TypePersonnage personnage;
    SDL_Texture   *spriteSheets[5];
    ConfigJoueur   config;
    int            offsetX;
    int            zoneW;
} Joueur;

typedef struct {
    TypeMode     mode;
    EtapeMenu    etape;
    int          selectionMode;
    int          selectionPersoJ1;
    int          selectionPersoJ2;
    int          selectionTenueJ1;
    int          selectionTenueJ2;
    int          selectionInputJ1;
    int          selectionInputJ2;
    ConfigJoueur configJ1;
    ConfigJoueur configJ2;
    SDL_Texture *imgPerso[2];
    SDL_Texture *imgTenues[2][3];
    SDL_Texture *imgBackground;
    SDL_Texture *imgLogo;
    Mix_Music   *musique;
    float        animTimer;
} EtatMenu;

extern SDL_Window   *fenetre;
extern SDL_Renderer *rendu;
extern TTF_Font     *policeGrande;
extern TTF_Font     *policeMoyenne;
extern TTF_Font     *policePetite;

SDL_Texture *chargerImage(const char *chemin);

void initialiserJoueur(Joueur *j, ConfigJoueur cfg, float startX);
void initialiserJoueur2(Joueur *j, ConfigJoueur cfg, float startX);
void animerJoueur(Joueur *j, float dt);
void deplacerJoueur(Joueur *j, SDL_Scancode *clavier);
void afficherJoueur(Joueur *j);
void afficherMenuJoueur(EtatMenu *em);

#endif
