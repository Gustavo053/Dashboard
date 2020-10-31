const { ipcMain } = require('electron');
const { exec } = require('child_process');

let operations = [];

//listenner do canal send-message
//recebe os dados enviados do frontend
ipcMain.on('send-message', (event, data) => {
    console.log(data);

    //verifica se o comando enviado foi o de parar alguma ação
    if (data == '^C') {
        //mata o processo que estava sendo executado
        operations.forEach((pid) => {
            exec('kill -9 ' + pid);
            exec('kill -9 ' + (pid + 1));
        });

        //Envia uma resposta para o front-end, indicando que foi executado
        // event.reply('send-response', 'executado');

        return;
    }
    //executado o data (comandos) que o usuário enviou
    const operation = exec(data, (err, stdout, stderr) => {
        if (err) {
            console.log(err);
            return;
        }

        console.log(data);
    });

    //adiciona o pid do processo executado no array para depois finalizar
    operations.push(operation.pid);
});