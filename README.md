<img src="https://github.com/pabloruizp/VuelaBarato/blob/master/public/logo.png" width="40%"><br><br>  

VuelaBarato es un servicio con la finalidad de ahorrarte dinero en tu vuelos. La aplicación te permite guardar vuelos y te avisará periodicamente con las novedades en estos.
 
## Prerequisitos
 
* [Node.js](https://nodejs.org/) > 12.0
* Cuenta de Gmail
 
## Instalación
 
Para descargar todos los archivos y librerías necesarias: 
```
git clone http://github.com/pabloruizp/VuelaBarato.git
cd VuelaBarato/
npm install
```  
  
Una vez todo instalado, será necesario crear un archivo en la carpeta **VuelaBarato** que se llame **credentials.txt**. Una vez creado este archivo se deberán de introducir los siguientes datos con este **formato exacto**:
```
emailname@gmail.com
contraseña
```
  
Por último, para poder enviar correos tendréis que ir a la configuración de vuestra cuenta [https://myaccount.google.com/lesssecureapps](https://myaccount.google.com/lesssecureapps) y habilitar el acceso a aplicaciones no seguras. Para evitar problemas, se recomienda que se cree una cuenta de Gmail **nueva** y que **no** se active la **verificación en dos pasos**
 
## Tiempo envío report
 
Antes de iniciar la aplicación se puede modificar el intervalo de tiempo que espera la aplicación entre correo y correo. Por **defecto** lo hace cada **60 minutos**, pero esto se puede cambiar modificando la constante **TIME_REPORT** (tiempo en minutos) en el archivo *app.js*
 
## Uso
 
Una vez esté instalado todo, ejecutad el siguiente comando:
```
npm start
```
  
Una vez hecho esto la aplicación ya se estará ejecutando. Para poder guardar los vuelos que os interesen, id a la página [https://www.ryanair.com/es/es/vuelos-baratos/](https://www.ryanair.com/es/es/vuelos-baratos/) y buscad los viajes que os interesen.
 
<img src="https://github.com/pabloruizp/VuelaBarato/blob/master/media/1.png" width="70%"><br><br>  
 
 
Una vez tengáis las búsquedas, id a [http://localhost:3000/url](http://localhost:3000/url) e introducid las URLs una a una.
 
<img src="https://github.com/pabloruizp/VuelaBarato/blob/master/media/2.png" width="70%"><br><br>  
 
 
Una vez hecho todo, simplemente accediendo a la página [http://localhost:3000](http://localhost:3000) se podrán ver todos los vuelos que coinciden con vuestras búsquedas. Y, siempre que se mantenga el proceso activo, un correo se irá enviando periódicamente. 
 
<img src="https://github.com/pabloruizp/VuelaBarato/blob/master/media/3.png" width="70%"><br><br>  


## Advertencias  

Esta es una aplicación no oficial que usa la información de vuelos de la empresa Ryanair. Está hecha con fines no lucrativos y para ser usadada en local. El hosteo de esta aplicación o el uso con fines lucrativos de la misma queda bajo reponsabilidad legal del usuario.
