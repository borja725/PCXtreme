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

# Instala dependencias de Composer (sin dev, optimizado)
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Crea el directorio de cache y logs
RUN mkdir -p var/cache var/log && chown -R www-data:www-data var

# Instala Caddy (servidor web recomendado por Fly.io para PHP)
RUN apt-get install -y debian-keyring debian-archive-keyring apt-transport-https \
    && curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | apt-key add - \
    && curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list \
    && apt-get update && apt-get install caddy

# Copia configuración de Caddy
COPY Caddyfile /etc/caddy/Caddyfile

# Expon el puerto 8080 (Fly.io)
EXPOSE 8080

# Comando de inicio
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
