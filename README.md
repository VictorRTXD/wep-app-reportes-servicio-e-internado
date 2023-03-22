# Web APP Reportes Área de la Salud.

Autores: 
- Maria del Carmen Gonzalez Gonzalez
- Alexis de Jesus Aguirre Lara
- Ramón Paredes Sánchez.
- Erik Raul Aguirre Lara.

## Acerca de este proyecto.
Esta parte del proyecto constituye al *front-end* de la aplicación para generar reportes de Servicio Social para las carreras del área de la salud. Esta app está escrita en **TypeScript** y **React**. La aplicación consiste en una app de página única. La aplicación fue inicializada utilizando [Create React App](https://github.com/facebook/create-react-app).

## Entorno.
Para la ejecución de la app, es necesario contar con una instalación de **React** y **NodeJS** en el servidor. Estas dependencias ya deberían estar instaladas.
Nota: Las credenciales de acceso al servidor deben de consultarse con el encargado del proyecto.

## Compilación del código y servicio al cliente.
Para que el cliente pueda utilizar la app, es necesario *servirla*. Para ello, es necesario contar con un servicio que redirija a los usuarios a la página principal. Para servir la app, se necesitan realizar los siguientes pasos:

1. Ir a la carpeta var para crear la ruta del proyecto ```var/www/```.
2. Borrar la versión anterior de la app (en caso de que la haya).
3. Clonar la nueva versión.
4. Descargar las dependencias del proyecto con el comando ```npm i```.
5. Instalar pm2 con el comando ```sudo npm install -g pm2```
6. En el archivo de configuración, cambiar Localhost por la dirección de la página + /api ```(http://rssalud.cualtos.udg.mx:443/api)```.
7. Agregar ```'react/jsx-no-bind': ['warn']```, en el archivo .eslintrc.js
8. Compilar con ```sudo npm run build```
9. Subir una carpeta y correr con ```sudo pm2 serve build 80 --spa```. 
**Nota de Ramón:** si al intentar levantar el proceso, aparece con status errored, utilizar pm2 resurrect. 
10. Una vez que el proceso está corriendo, usa el comando ```pm2 save``` para guardarlo y que se inicie aún cuando el sistema se reinicie.
11. Para ver el proceso corriendo, se puede usar el comando ```pm2 list```
12. Puedes ver más información de PM2 [aquí](https://pm2.keymetrics.io/docs/usage/startup/).
