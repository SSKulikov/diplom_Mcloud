## Предварительная подготовка системы

При развёртывании на сервере используется связка `Django + gunicorn + nginx`.

Весь пошаговый план действий указан для операционной системы `Ubuntu 22.04 LTS`, чистая установка.

Весь процесс будет описан для пользователя с именем `admin`, `*.*.*.*` - IP-адрес вашего сервера. 

- Подключаемся к серверу.

`ssh root@80.78.242.41`

- Создаём пользователя `admin`, даём ему права и переключаемся на него.
```
adduser admin
usermod admin -aG sudo
su admin
```
- Обновляем систему.

`sudo apt update && sudo apt upgrade -y`

- Переразгружаем систему.

`[ -e /var/run/reboot-required ] && sudo reboot`

- Подключаемся к серверу уже под нашей учётной записью.

`ssh admin@80.78.242.41`

- Устанавливаем необходимые пакеты, в том числе сервер `nginx`.

`sudo apt-get install python3-pip python3-dev libpq-dev postgresql postgresql-contrib nginx`

- Далее нам надо установить `node` последней версии, делать это будем с помощью `nvm`.

```
wget https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh
bash install.sh
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
source ~/.bashrc
nvm install node
npm update npm -g
```

- Клонируем наш проект в домашнюю директорию пользователя.

`git clone https://github.com/nfadeaway/cloud.git`

## Настройка backend

- Создаём базу данных. Замените `{ИМЯ БД}` и `{ПАРОЛЬ БД}` на свои данные.

```
sudo -u postgres psql
CREATE DATABASE postgres;
ALTER USER postgres WITH PASSWORD 'postgres';
\q
```
- Открываем файл настроек backend `.env.example`, заполняем своими данными и сохраняем под именем `.env`.

`nano ~/diplom_Mcloud/CloudStorage/.env-example`

```

# DJANGO
SECRET_KEY='django-insecure-35qw*#+mcdcpg2*v7!i_hnh-$qcj_h@#um=1@#l6_b!d1@8&mb'
LANGUAGE_CODE='ru-ru'
CLOUD_DIR='storage'

# DB SETTINGS
DB_ENGINE='django.db.backends.postgresql'
DB_NAME='postgres'
DB_HOST='127.0.0.1'
DB_PORT='5432'
DB_USER='postgres'
DB_PASSWORD='postgres'

# ALLOWED_HOSTS
ALLOWED_HOSTS=['80.78.242.41', '127.0.0.1']


# Logging
DJANGO_LOG_LEVEL='DEBUG'

# Production
DEBUG=True
CSRF_COOKIE_SECURE=False
SESSION_COOKIE_SECURE=False
```

- Переходим в папку с нашим backend-приложением.

`cd diplom_Mcloud/CloudStorage`

- Далее устанавливаем и активируем виртуальное окружение.

```
python3 -m venv .venv
```
- комада для входа в виртуальное окружение
```
source .venv/bin/activate
```

- Устанавливаем все пакеты для работы `Django`, в том числе `gunicorn`.

`python3 -m pip install -r requirements.txt`

- Делаем миграции и создаём суперпользователя.

```
python manage.py migrate
python manage.py createsuperuser
```

- Создём сервисный файл для `gunicorn`.

`sudo nano /etc/systemd/system/gunicorn.service`

```
[Unit]
Description=gunicorn service
After=network.target

[Service]
User=admin
Group=www-data
WorkingDirectory=/home/admin/diplom_Mcloud/CloudStorage
ExecStart=/home/admin/diplom_Mcloud/CloudStorage/.venv/bin/gunicorn --access-logfile - --workers=3 --bind 0.0.0.0:8000 CloudStorage.wsgi:application

[Install]
WantedBy=multi-user.target
```

- Запускаем сервис и проверяем его статус, что ошибок нет.

```
sudo systemctl start gunicorn
sudo systemctl enable gunicorn
sudo systemctl status gunicorn
```

- В случае внесения исправлений в файл `gunicorn.service` нужно перезапустить сервис.

```
sudo systemctl daemon-reload
sudo systemctl restart gunicorn
sudo systemctl status gunicorn
```

## Настройка nginx

- Делаем бекап дефолтного файла настроек сервера.

`sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.bak`

- Открываем и редактируем файл настроек для нашего сервера.

`sudo nano /etc/nginx/sites-available/default`

```
server {
  listen 80 default_server;
  root /var/www/dist;
  server_name _;

  location / {
    try_files $uri $uri/ /index.html;
  }

  location /api {
    proxy_pass http://127.0.0.1:8000/api;
  }

  location /f/ {
    proxy_pass http://127.0.0.1:8000/f/;
  }
}
```

- Даём `nginx` полные права в брандмауэре и перезапускаем его.

```
sudo ufw allow 'Nginx Full'
sudo nginx -s reload
```

## Настройка frontend

- Выходим из виртуального окружения.

`deactivate`

- Переходим в папку с frontend-частью приложения и устанавливаем все пакеты.

```
cd ~/diplom_Mcloud/frontend
npm install
```
- Если npm install не работает можно, локально(на своём копьютере) запустить эту же команду из папки с фронтендом(незабыв поменять в файле .env ip на свой как в следующем шаге), после сделать npm run build. И все файлы из папки frontend на личном компе перекинуть в папку frontend на сервере через WinSCP(все шаги кроме npm install и npm run build нужно сделать в любом случае).

- Открываем файл настроек frontend `.env.example`, заполняем своими данными и сохраняем под именем `.env`.

`nano .env.example`

`VITE_APP_SERVER_URL=http://80.78.242.41:8000`

- Создаём наш билд для frontend-приложения.

`npm run build`

- Удаляем дефолтную папку с файлами статики `nginx` и перемещаем вместо неё свою сборку frontend.

```
sudo rm -rf /var/www/dist
sudo mv /home/admin/diplom_Mcloud/frontend/dist /var/www
```
- Перезапускаем `nginx`.

`sudo systemctl restart nginx`

## Сайт должен открываться по вашему адресу `http://80.78.242.41`