FROM php:8.2-fpm

# Instala dependencias necesarias
RUN apt-get update \
    && apt-get install -y git unzip libicu-dev libpq-dev libzip-dev libpng-dev libjpeg-dev libfreetype6-dev libonig-dev curl \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install intl pdo pdo_pgsql opcache zip gd

# Instala Composer globalmente
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /app

# Copia todos los archivos al contenedor
COPY . .

# Permite que Composer se ejecute como root (para evitar warnings)
ENV COMPOSER_ALLOW_SUPERUSER=1

# Instala dependencias PHP del proyecto
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# Crea carpetas para cache y logs con permisos correctos
RUN mkdir -p var/cache var/log && chown -R www-data:www-data var

# Instala Caddy
RUN curl -1sLf 'https://caddyserver.com/api/download?os=linux&arch=amd64' -o /usr/bin/caddy \
    && chmod +x /usr/bin/caddy

# Copia tu archivo de configuración Caddyfile
COPY Caddyfile /etc/caddy/Caddyfile

# Expone el puerto que usará Caddy (el mismo que Fly.io espera)
EXPOSE 8080

# Arranca PHP-FPM y Caddy juntos
CMD php-fpm & caddy run --config /etc/caddy/Caddyfile --adapter caddyfile
