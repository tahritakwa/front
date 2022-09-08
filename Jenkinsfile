pipeline {
  agent any
  stages {
    stage ('Git Checkout') {
      agent any
      steps {
        git branch: 'master', credentialsId: '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', url: 'https://github.com/tahritakwa/front.git'
    }
  }
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
