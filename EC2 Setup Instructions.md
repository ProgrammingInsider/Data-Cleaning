# EC2 Setup Instructions

Follow the steps below to set up your EC2 instance for running your full-stack app.

---

### **1️⃣ Install Node.js & npm (using nvm)**

```bash
# Switch to superuser (root) account
sudo su -

# Install nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Activate nvm
. ~/.nvm/nvm.sh

# Install the latest version of Node.js using nvm
nvm install node

# Verify that Node.js and npm are installed
node -v
npm -v

# Update the system and install Git
sudo yum update -y
sudo yum install git -y

# Verify Git installation
git --version

# Clone your code repository from GitHub
git clone [your-github-link]

# Navigate to the project directory
cd [your-project-directory]

# Install the dependencies for your project
npm install

# Create a `.env` file and set the port (optional)
echo "PORT=80" > .env

# Start the application (development mode for testing)
npm start

# Install pm2 globally
npm install pm2 -g

# Create a pm2 ecosystem configuration file
nano ecosystem.config.cjs

# Add the following configuration (modify as necessary) in server root directory under ecosystem.config.js

module.exports = {
  apps: [
    {
      name: "your-app-name",
      script: "npm",
      args: "run start",
      env: {
        NODE_ENV: "production",
        PORT: 80,
      },
    },
  ],
};

# Start the app using pm2
pm2 start ecosystem.config.js

# Set pm2 to restart on system reboot
sudo env PATH=$PATH:$(which node) $(which pm2) startup systemd -u $USER --hp $(eval echo ~$USER)

# Check pm2 status
pm2 status

# Install Nginx
sudo yum install nginx -y

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Configure Nginx for your app
sudo nano /etc/nginx/nginx.conf

server {
  listen 80;

  server_name your_domain_or_public_ip;

  location / {
    proxy_pass http://localhost:80;  # Your app is running on port 80
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}

# Test and reload Nginx
sudo nginx -t
sudo systemctl reload nginx

# Install Certbot (Let’s Encrypt SSL)
sudo yum install epel-release -y
sudo yum install certbot python3-certbot-nginx -y

# Obtain the SSL certificate
sudo certbot --nginx -d your_domain_or_public_ip

# Renew SSL certificate automatically (Cron job)
sudo crontab -e

# Add this line to renew the certificate periodically:
0 0 * * * certbot renew --quiet


This version consolidates all commands into a single block under each section to make it easier to copy and execute.

