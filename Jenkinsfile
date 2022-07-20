pipeline {
    agent any
    tools {nodejs "nodejs-16"}
    environment {
        REGISTRY = 'registry.ekbana.net'
        HARBOR_NAMESPACE = "myplace"
        HARBOR_CREDENTIAL = credentials('myplace-cred')
        APP_NAME = "myplace-app"
        DIR_NAME = getDirName(env.BRANCH_NAME)
        scannerHome = tool 'SonarQubeScan';
    }
    stages {
        stage('get_commit_msg') {
            steps {
              script {
                notifyStarted()
                passedBuilds = []
                lastSuccessfulBuild(passedBuilds, currentBuild);
                env.changeLog = getChangeLog(passedBuilds)
                echo "changeLog \n${env.changeLog}"
              }
            }
        }
        stage("Checkout code") {
            steps {
                checkout scm
            }
        }
        stage('Analysis & Deploy') {     
          parallel{
            stage('SonarQube Analysis') {
              steps {           
                withSonarQubeEnv(installationName: 'SonarQubePro') {
                sh "${scannerHome}/bin/sonar-scanner"
              }
              }
            }
            stage('Build&Deploy'){
                stages{
                    stage("Build image") {
                        steps {
                            sh 'docker build -t $REGISTRY/$HARBOR_NAMESPACE/$APP_NAME:SNAPSHOT-$BRANCH_NAME-$BUILD_NUMBER .'
                        }
                    }
                    stage("Harbor login & Push image") {
                        steps {
                            sh '''echo $HARBOR_CREDENTIAL_PSW | docker login $REGISTRY -u 'robot$myplace+myplace' --password-stdin'''
                            sh 'docker push  $REGISTRY/$HARBOR_NAMESPACE/$APP_NAME:SNAPSHOT-$BRANCH_NAME-$BUILD_NUMBER'
                            sh 'docker rmi $REGISTRY/$HARBOR_NAMESPACE/$APP_NAME:SNAPSHOT-$BRANCH_NAME-$BUILD_NUMBER'
                        }
                    }
                    stage('Deploy to dev server') {
                        steps{
                        script {
                            sshagent(['72c3455a-de8d-4b39-9f02-771ddb2fdf00']) {
                            sh '''
                            ssh -tt -o StrictHostKeyChecking=no root@159.89.161.57 -p 3030 << EOF
                            cd $DIR_NAME; \
                            cat /root/.docker/uat-server.txt | docker login registry.ekbana.net --username 'robot$uat-server' --password-stdin; \
                            docker pull  $REGISTRY/$HARBOR_NAMESPACE/$APP_NAME:SNAPSHOT-$BRANCH_NAME-$BUILD_NUMBER; \
                            docker-compose -f docker-compose.yml down; \
                            BUILD_NUMBER=$BUILD_NUMBER docker-compose -f docker-compose.yml up -d; \
                            docker image prune -a -f; \
                            exit
                        EOF '''
                        }
                        }
                    }    
                    }
                }
            }
          }
        
    }
    }

    post{
      success{
        //script {
          //if (env.BRANCH_NAME == 'dev' || env.BRANCH_NAME == 'qa' || env.BRANCH_NAME == 'uat' )
            notifySuccessful()
        //}
      }
      failure{
        notifyFailed()
      }
    }
}

def notifyStarted() {
mattermostSend (
  color: "#2A42EE",
  channel: 'myplace-jenkins',
  endpoint: 'https://ekbana.letsperk.com/hooks/xrihic4ipfrc7ktf5zn7hbfthw',
  message: "Build STARTED: ${env.JOB_NAME} #${env.BUILD_NUMBER} (<${env.BUILD_URL}|Link to build>)"
  )
}


def notifySuccessful() {
mattermostSend (
  color: "#00f514",
  channel: 'myplace-jenkins',
  endpoint: 'https://ekbana.letsperk.com/hooks/xrihic4ipfrc7ktf5zn7hbfthw',
  message: "Build SUCCESS: ${env.JOB_NAME} #${env.BUILD_NUMBER} (<${env.BUILD_URL}|Link to build>):\n${changeLog}"
  )
}

def notifyFailed() {
mattermostSend (
  color: "#e00707",
  channel: 'myplace-jenkins',
  endpoint: 'https://ekbana.letsperk.com/hooks/xrihic4ipfrc7ktf5zn7hbfthw',
  message: "Build FAILED: ${env.JOB_NAME} #${env.BUILD_NUMBER} (<${env.BUILD_URL}|Link to build>)"
  )
}
def lastSuccessfulBuild(passedBuilds, build) {
  if ((build != null) && (build.result != 'SUCCESS')) {
      passedBuilds.add(build)
      lastSuccessfulBuild(passedBuilds, build.getPreviousBuild())
   }
}

@NonCPS
def getChangeLog(passedBuilds) {
    def log = ""
    for (int x = 0; x < passedBuilds.size(); x++) {
        def currentBuild = passedBuilds[x];
        def changeLogSets = currentBuild.changeSets
        for (int i = 0; i < changeLogSets.size(); i++) {
            def entries = changeLogSets[i].items
            for (int j = 0; j < entries.length; j++) {
                def entry = entries[j]
                log += "* ${entry.msg} by ${entry.author} \n"
            }
        }
    }
    return log;
  }

//Getting branch name for respective branches
def getDirName(branchName) {
    if("dev".equals(branchName)) {
        return "/var/www/projects/myplace/dev/";
    } else if ("qa".equals(branchName)) {
        return "/var/www/projects/myplace/qa/";
    } else if ("uat".equals(branchName)) {
        return "/var/www/projects/myplace/uat/";
    } else {
        return "/var/www/projects/myplace/master/";
    }
}

