/*
    Simple udp client
    Silver Moon (m00n.silv3r@gmail.com)
*/
#include <stdio.h> //printf
#include <string.h> //memset
#include <stdlib.h> //exit(0);
#include <arpa/inet.h>
#include <sys/socket.h>
#include <unistd.h> //sleep()
#include <openssl/md5.h>
 
#define SERVER "127.0.0.1"
#define BUFLEN 512  //Max length of buffer
#define PORT 6000   //The port on which to send data
#define NUMBER_OF_SENSORS 3
//#define HASH_SIZE 32
#define HASH_SIZE 16
#define MSG_SIZE 5
#define FINAL_LENGHT NUMBER_OF_SENSORS*MSG_SIZE


char *str2md5(const char *str, int length) {
    int n;
    MD5_CTX c;
    unsigned char digest[16];
    char *out = (char*)malloc(33);

    MD5_Init(&c);

    while (length > 0) {
        if (length > 512) {
            MD5_Update(&c, str, 512);
        } else {
            MD5_Update(&c, str, length);
        }
        length -= 512;
        str += 512;
    }

    MD5_Final(digest, &c);

    for (n = 0; n < 16; ++n) {
        snprintf(&(out[n*2]), 16*2, "%02x", (unsigned int)digest[n]);
    }

    return out;
}

 
void die(char *s)
{
    perror(s);
    exit(1);
}
 
 const char * secret_word="S0*(dae{dse2\0";
 const char * false_word="00000ae{dse2\0";
 
int main(void)
{
    struct sockaddr_in si_other;
    int s,  slen=sizeof(si_other),i;
    int sensors[NUMBER_OF_SENSORS];
    char pre_hash_string[FINAL_LENGHT+1];
    char * message = (char *)malloc(HASH_SIZE+FINAL_LENGHT+1);
    char * hash_string = (char *)malloc(strlen(pre_hash_string)+strlen(secret_word));
    char * hash;
 
    if ( (s=socket(AF_INET, SOCK_DGRAM, IPPROTO_UDP)) == -1)
    {
        die("socket");
    }
 
    memset((char *) &si_other, 0, sizeof(si_other));
    si_other.sin_family = AF_INET;
    si_other.sin_port = htons(PORT);
     
    if (inet_aton(SERVER , &si_other.sin_addr) == 0)
    {
        fprintf(stderr, "inet_aton() failed\n");
        exit(1);
    }
	int fix=0;
    while(1)
    {
		int cx=0;
		for(i=0;i<NUMBER_OF_SENSORS;i++){
				sensors[i]=rand()%9999;
				
				cx+=snprintf(pre_hash_string+cx,6,"%d%04.4d",i+1,sensors[i]);
				
				//printf("%d\n%04.4d\n",cx,sensors[i]);
				//sprintf("%d\n%d\n",i,sensors[i]);
			}
		//pre_hash_string[(NUMBER_OF_SENSORS*5)]='\0';
		puts("Sensors Data:");
		puts(&pre_hash_string);
		if(!fix%5==0)
		strcpy(hash_string,secret_word);
		else
		strcpy(hash_string,false_word);
		strcat(hash_string,pre_hash_string);
		puts("String to Hash:");
		puts(hash_string);
		hash = (str2md5(hash_string,strlen(hash_string)));
		hash[HASH_SIZE]='\0';
		puts("Sensors Data Hash:");
		puts(hash);
		strcpy(message,hash);
		strcat(message,pre_hash_string);
		puts("Final Message:");
		puts(message);
		if (sendto(s, message, strlen(message) , 0 , (struct sockaddr *) &si_other, slen)==-1)
		{
			die("sendto()");
		}
		sleep(3);
			fix++;
         if(fix==10)fix=0;
        
    }
	free(hash);
	free(message);
	free(hash_string);
    close(s);
    return 0;
}
