NAME 	= 	all

APP  	=	fe

URL		=	036662324928.dkr.ecr.ap-southeast-1.amazonaws.com/eventmanager/

TAG 	=	latest v1 v1.0 v1.0.10

all:	build tag 

build:
		docker buildx build --platform linux/amd64 -t eventmanager/frontend:latest . 

tag:	$(TAG)

$(TAG):
		docker tag eventmanager/frontend:latest $(URL)$(APP):$@
		aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin 036662324928.dkr.ecr.ap-southeast-1.amazonaws.com
		docker push $(URL)$(APP):$@