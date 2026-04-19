CC      = gcc
CFLAGS  = -Wall -Wextra -std=c99
LIBS    = -lSDL2 -lSDL2_image -lSDL2_ttf -lSDL2_mixer -lm
TARGET  = joueur
SRCS    = main.c joueur.c
OBJS    = $(SRCS:.c=.o)

all: $(TARGET)

$(TARGET): $(OBJS)
	$(CC) $(CFLAGS) -o $@ $^ $(LIBS)

%.o: %.c joueur.h
	$(CC) $(CFLAGS) -c -o $@ $<

clean:
	rm -f $(OBJS) $(TARGET)

run: all
	./$(TARGET)

.PHONY: all clean run
