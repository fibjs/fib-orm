PWD=$(pwd)

case "${RUNNER_OS}" in
    Windows) ;;
    macOS)
        brew install psqlodbc;
        cd Dockerfile;
        docker-compose up -d;
        ;;
    Linux)
        sudo apt-get update;
        sudo apt-get install odbc-postgresql
        cd Dockerfile;
        docker-compose up -d;
        cd ..;
        ;;
esac

cd $PWD;

npm install;
./node_modules/.bin/lerna bootstrap;
npm run ci;