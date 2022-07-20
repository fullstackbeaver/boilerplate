const args       = process.argv.slice(2);
const methods    = require("boilerplate-base");
const folderName = methods.getCurrentFolder();
const List       = require('prompt-list');
const path = __dirname+"/templates";

(async()=>{
  const templateChoice = new List({
    name   : 'templateChoice',
    message: 'select base',
    choices: methods.getFoldersList(path)
  });

  const template = await templateChoice.run();

  //duplication des fichiers
  methods.copyFolderContentSync(`${path}/${template}`, process.cwd());

  //mise à jour du package.json avec le bon nom de projet
  methods.replaceInFile(process.cwd()+"/package.json", "-folder_name-", methods.normalizeProjectNameForNpm(folderName));

  //met à jour les dépendances si demandé via ligne de commande
  if (args.includes("update")) methods.executeTask('npx npm-check-updates -u',"mise à jour des dépendances");

  //installation des dépendances
  methods.executeTask('npm i --depth 9999',"installation des dépendances");

})()