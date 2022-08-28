pipeline {
  agent any
  stages {
    stage('server') {
      steps {
        sh 'docker build -t front_image .'
      }
    }
    stage('docker') {
      steps {
        sh 'docker-compose up --build -d'
      }
    }

  }
}
