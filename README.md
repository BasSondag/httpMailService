httpService


This service is built with Node version 10.16.0.
I chose to work with JavaScript and the Express framework because I feel the most comfortable using these.

I used the 'he' library to convert HTML entities. If I had more time I would have liked to find a library that converts the HTML to text in order to preserve the layout.

I started to use the request library to send the api request because I had difficulty with implementing the fallback for the second mail service, therefore, I added the request-promise.

In order to keep to the time limit I built all of the functionality in the email controller. For future builds, I would like to create better functionality in a more modular way so that it is easier to add more email services.

To run the service:

update the config_example.json in server/config.
rename the config_example.json to config.json.
run npm install form where the package.json is.
run nmp start form where the package.json is.
