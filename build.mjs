import {mkdir,copyFile,cp,rm} from 'node:fs/promises';
const dist=new URL('./dist/',import.meta.url);
await rm(dist,{recursive:true,force:true});await mkdir(dist,{recursive:true});
for(const name of ['index.html','styles.css','app.js','hero.js','building.js','data.js','_redirects','_headers'])await copyFile(new URL(name,import.meta.url),new URL(name,dist));
await cp(new URL('./assets/',import.meta.url),new URL('./assets/',dist),{recursive:true});
console.log('Static website built in dist/.');
