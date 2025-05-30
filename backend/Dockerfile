# Dockerfile para Symfony en Fly.io
FROM php:8.2-fpm

# Instala dependencias del sistema
RUN apt-get update \
    && apt-get install -y git unzip libicu-dev libpq-dev libzip-dev libpng-dev libjpeg-dev libfreetype6-dev libonig-dev \
    && docker-php-ext-install intl pdo pdo_pgsql opcache zip gd

# Instala Composer manualmente
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copia el código fuente
WORKDIR /app
COPY . .

# Permite plugins de Composer como root (por compatibilidad)
ENV COMPOSER_ALLOW_SUPERUSER=1

# Instala dependencias de Composer (sin dev, optimizado) como root
RUN composer install -vvv

# Crea el directorio de cache y logs
RUN mkdir -p var/cache var/log && chown -R www-data:www-data var

# Instala Caddy descargando el binario oficial
RUN apt-get install -y curl \
    && curl -1sLf 'https://caddyserver.com/api/download?os=linux&arch=amd64' -o /usr/bin/caddy \
    && chmod +x /usr/bin/caddy

# Copia configuración de Caddy
COPY Caddyfile /etc/caddy/Caddyfile

# Expon el puerto 8080 (Fly.io)
EXPOSE 8080

# Comando de inicio
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
