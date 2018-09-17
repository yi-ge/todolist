# To-do List
A minimalism vue + php to-do list.

正在开发中

前端来自：https://github.com/nourabusoud/vue-todo-list
后端参考（灵感来源）：https://github.com/timbotron/taskshare

需要PHP5.4及以上版本。

### PHP 5.4's Built-In Web Server

PHP's latest stable version has its own built-in Web server. Start it up using the following configuration:-

```
php -S localhost:80 -t /var/www/
```

The above command will start routing all requests to the Web root `/var/www`. If an incoming HTTP request for a file or folder is received, PHP will look for it inside the Web root and send it over to the browser if found. Otherwise, PHP will load the default `index.php` (containing your F3-enabled code).

### Sample Apache Configuration

If you're using Apache, make sure you activate the URL rewriting module (mod_rewrite) in your apache.conf (or httpd.conf) file. You should also create a .htaccess file containing the following:-

``` apache
# Enable rewrite engine and route requests to framework
RewriteEngine On

# Some servers require you to specify the `RewriteBase` directive
# In such cases, it should be the path (relative to the document root)
# containing this .htaccess file
#
# RewriteBase /

RewriteRule ^(tmp)\/|\.ini$ - [R=404]

RewriteCond %{REQUEST_FILENAME} !-l
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule .* index.php [L,QSA]
RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization},L]
```

The script tells Apache that whenever an HTTP request arrives and if no physical file (`!-f`) or path (`!-d`) or symbolic link (`!-l`) can be found, it should transfer control to `index.php`, which contains our main/front controller, and which in turn, invokes the framework.

The `.htaccess file` containing the Apache directives stated above should always be in the same folder as `index.php`.

You also need to set up Apache so it knows the physical location of `index.php` in your hard drive. A typical configuration is:-

``` apache
DocumentRoot "/var/www/html"
<Directory "/var/www/html">
    Options -Indexes +FollowSymLinks +Includes
    AllowOverride All
    Order allow,deny
    Allow from All
</Directory>
```

If you're developing several applications simultaneously, a virtual host configuration is easier to manage:-

``` apache
NameVirtualHost *
<VirtualHost *>
    ServerName site1.com
    DocumentRoot "/var/www/site1"
    <Directory "/var/www/site1">
        Options -Indexes +FollowSymLinks +Includes
        AllowOverride All
        Order allow,deny
        Allow from All
    </Directory>
</VirtualHost>
<VirtualHost *>
    ServerName site2.com
    DocumentRoot "/var/www/site2"
    <Directory "/var/www/site2">
        Options -Indexes +FollowSymLinks +Includes
        AllowOverride All
        Order allow,deny
        Allow from All
    </Directory>
</VirtualHost>
```

Each `ServerName` (`site1.com` and `site2.com` in our example) must be listed in your `/etc/hosts` file. On Windows, you should edit `C:/WINDOWS/system32/drivers/etc/hosts`. A reboot might be necessary to effect the changes. You can then point your Web browser to the address `http://site1.com` or `http://site2.com`. Virtual hosts make your applications a lot easier to deploy.

### Sample Nginx Configuration

For Nginx servers, here's the recommended configuration (replace ip_address:port with your environment's FastCGI PHP settings):-

``` nginx
server {
    root /var/www/html;
    location / {
        index index.php index.html index.htm;
        try_files $uri $uri/ /index.php?$query_string;
    }
    location ~ \.php$ {
        fastcgi_pass ip_address:port;
        include fastcgi_params;
    }
}
```

### Sample Lighttpd Configuration

Lighttpd servers are configured in a similar manner:-

```
$HTTP["host"] =~ "www\.example\.com$" {
    url.rewrite-once = ( "^/(.*?)(\?.+)?$"=>"/index.php/$1?$2" )
    server.error-handler-404 = "/index.php"
}
```

### Sample IIS Configuration

Install the [URL rewrite module](http://www.iis.net/downloads/microsoft/url-rewrite) and the appropriate .NET framework corresponding to your Windows version. Then create a file named `web.config` in your application root with the following contents:

```
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="Application" stopProcessing="true">
          <match url=".*" ignoreCase="false" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" ignoreCase="false" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" ignoreCase="false" negate="true" />
          </conditions>
          <action type="Rewrite" url="index.php" appendQueryString="true" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```
