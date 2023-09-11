

## MERN Stack

This is an accelerator fro a MERN (Mongo, Express, React, Node) Stack.
It may be run in development or production mode. It is written entirely in TypeScript and is a bare bones implementation. It does include Vittest for testing both client-side and server-side code.

It allows a full stack application to be rapidly developed with an database, API and UI.

With a bit more setup the application may be deployed to AWS Elastic Beanstalk via a GitHub Actions pipeline – see guides below.

### Requirements
Minimum requirements:
- **GitHub** account (free tier available): [https://github.com/](https://github.com/)
- **DockerHub** account (free tier available): [https://hub.docker.com/](https://hub.docker.com/)
- **Node** [https://nodejs.org/en/download](https://nodejs.org/en/download) or for more control over which version of Node to run, **Node Version Manager(nvm)** for Windows: [https://github.com/coreybutler/nvm-windows](https://github.com/coreybutler/nvm-windows) or for Mac (using Homebrew): [https://formulae.brew.sh/formula/nvm](https://formulae.brew.sh/formula/nvm)
- **The Docker Desktop App** [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
- **Mongodb Compass** A GUI for editing local and remote Mongodb databases [https://www.mongodb.com/try/download/compass](https://www.mongodb.com/try/download/compass). This will be needed to add the initial database 'testbase' to the containerised Mongodb instance.

To run in production mode or release to production will require the following:
- **Mongo Atlas** account (a cloud based MongoDB SAS platform with a free tier) [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)
- **Amazon Web Services (AWS)** account [https://aws.amazon.com/?nc2=h_lg](https://aws.amazon.com/?nc2=h_lg)


### GitHub Secrets

The following 'Secrets' will require adding to the GitHub repo:

    DOCKER_USERNAME
    DOCKER_PASSWORD
    AWS_ACCESS_KEY
    AWS_SECRET_KEY

If not deploying to AWS, in the file '.github/workflows/deploy.yml', comment out or delete the final selection beginning ``` - name: Deploy to EB``` as this will fail if correct AWS Keys are not supplied

Details of how to obtain the correct values are described below in the relevant sections.

To add the Secrets, in the project’s Git repository, go to Settings -> Secrets and variables -> actions. Click the 'New repository secret' button and add the key value pairs. Make a record of them as, once set, they are no longer accessible and don't save the record in the repository. They are safe to use in public repositories as they cannot be accessed once set.

## Development mode

### Setup Development
Install [Mongo Compass](https://www.mongodb.com/products/compass) and add a new database called 'testbase' with a collection called 'products'. The app will add items withe the following shape:

```
{
  "name": "test",
  "price": 22
}
```

### Database initialization – development
run:
```
$ yarn dev:up:build
```
Open the MongoDB Compass application, from the Connect menu choose ‘New window’ to open the connection in a new window and click the ‘New connection’ button. 

In the URI field type: ```mongodb://localhost:27017 ```. 

Drop down the ‘Advanced Connection Options’ menu, select ‘Authentication’ and choose ‘Authentication Method -> Username/Password’. 

Username and password are both 'root'. This is set in the ```docker-compose.dev.yml``` file and may be changed here, if you wish: 

```yaml
services:
# MogoDb Services
# -- lines ommited for brevity --
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: root
```
In the Compass window, from the side menu click the **+** icon (see below).
```
{} My Queries
🗄️  Databases  🔄 +
```
Call the database **‘testbase’** and the collection **‘products’**. 

Click on the ‘Create database‘ button.


### Run Development
run:
```bash
$ yarn dev:up 
```
or, to rebuild the containers, if any changes have been made to Docker code, run:
```bash
$ yarn dev:up: build 
```

In development mode there is live updating of both the client and server code with the client-side React app live reloading on change.

There is a local version of Mongo which runs in a Docker container and has a Docker volume which persists data between restarts.

This should run with no additional setup as database, api and front-end are all self contained.

This builds the following:


![Development diagram](readme_images/DockerComposeDiagram_dev.png)


## Production mode

running ```prod:up:build``` will create a local build which accesses the production cloud database and allows for testing with real data. NB anyone accessing the Mongodb Atlas database will need to be added to the whitelisted IP addresses under ‘Security -> Database Access’
### Database initialisation – production
If you do not already have an account with [MongoDb](https://cloud.mongodb.com/) set one up – free tiers are available.

Go to the ‘MongoDB Atlas’ portal and create a new project, name it anything you wish.

Click the ‘CONNECT’ button and under ‘Connect to your application’ click ‘Drivers’, choose ‘Node.js 5.5 or later’ and under ‘3. 

Add your connection string into your application code’ copy the connection string, adding the password, where indicated. Add this to the file ‘docker-compose.yml’ 
```yaml
# API Services
  api:
    build: 
   # ommited for brevity

    environment:
      PORT: 5000
      MONGO_URI: mongodb+srv://connection-string-just-copied
      # ommited for brevity

```
In the left menu, select ‘Database’ and click the ‘Browse Collections’ button.

Choose ‘Add my own data’ and create a database called 'testbase' and a collection called 'products' – the naming is to match the requirements of the boilerplate code. 


```bash
$ yarn prod:up 
```
or, to rebuild the containers
```bash
$ yarn prod:up: build 
```
This builds the following (NB: This is a local build, allowing a local dry-run before pushing to production.):


![Alt text](readme_images/DockerComposeDiagram_prod.png)

# AWS Setup

## Create EC2 IAM Role
<ol>
<li>Go to AWS Management Console</li>
<li>Search for <strong>IAM</strong> and click the IAM Service.</li>
<li>Click <strong>Roles</strong> under <strong>Access Management</strong> in the left sidebar.</li>
<li>Click the <strong>Create role</strong> button.</li>
<li>Select <strong>AWS Service</strong> under <strong>Trusted entity type</strong> Then select <strong>EC2</strong> under <strong>common use cases</strong>.</li>
<li>Search for <strong>AWSElasticBeanstalk</strong> and select: 
  <ul>
<li>AWSElasticBeanstalkEnhancedHealth	</li>
<li>AWSElasticBeanstalkManagedUpdatesCustomerRolePolicy	</li>
<li>AWSElasticBeanstalkMulticontainerDocker	A</li>
<li>AWSElasticBeanstalkWorkerTier</li>
  </ul>
 policies. Click the <strong>Next</strong> button.</li>
 <li>Add the following Services to <strong>Trust Entities</strong> by opening the the <strong>Trust relationships</strong> tab
 <ul>
   <li>elasticbeanstalk.amazonaws.com</li>
  <li>ec2.amazonaws.com</li>
 </ul>
<em>* See Trusted entities below for format</em>
  </li>
<li>Give the role the name of <strong>aws-elasticbeanstalk-ec2-role<strong></li>
<li>Click the <strong>Create role</strong> button.</li>
</ol>

**Trusted entities*

Trust relationships->Trusted entities should be as follows:
 ```json
  {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Service": [
                    "elasticbeanstalk.amazonaws.com",
                    "ec2.amazonaws.com"
                ]
            },
            "Action": "sts:AssumeRole"
        }
    ]
}
  ```

## Create Elastic Beanstalk Environment

<ul>

</ul>

1. Go to AWS Management Console
2. Search for **Elastic Beanstalk** and click the Elastic Beanstalk service.
3. If you've never used Elastic Beanstalk before you will see a splash page. Click the **Create Application** button. If you have created Elastic Beanstalk environments and applications before, you will be taken directly to the Elastic Beanstalk dashboard. In this case, click the **Create environment** button. There is now a flow of 6 steps that you will be taken through.
4. You will need to provide an Application name, which will auto-populate an Environment Name.
5. Scroll down to find the Platform section. You will need to select the Platform of **Docker**. This will auto-populate the rest of the fields.
6. Scroll down to the Presets section and make sure that **free tier eligible** has been selected:
7. Click the **Next** button to move to Step #2.
8. You will be taken to a Service Access configuration form.
9. If you are presented with a blank form where the **Existing Service Roles** field is empty, then, you should select **Create and use new service role**. You will need to set the **EC2 instance profile** to the **aws-elasticbeanstalk-ec2-role** created earlier (this may be auto-populated for you).
10. If both **Existing Service Roles** and **EC2 Instance Profiles** are populated with default values, then, select **Use an existing service role**.
11. Click the **Skip to Review** button as Steps 3-6 are not applicable.
12. Click the **Submit** button and wait for your new Elastic Beanstalk application and environment to be created and launched.
13. Click the link below the checkmark under Domain. This should open the application in your browser and display a Congratulations message.

## Update Object Ownership of S3 Bucket
<ol>
<li>Go to AWS Management Console</li>
<li>Search for <strong>S3</strong> and click the S3 service.</li>
<li>Find and click the elasticbeanstalk bucket that was automatically created with your environment.</li>
<li>Click <strong>Permissions</strong> menu tab</li>
<li>Find <strong>Object Ownership</strong> and click <strong>Edit</strong></li>
<li>Change from <strong>ACLs disabled</strong> to <strong>ACLs enabled</strong>. Change <strong>Bucket owner Preferred</strong> to <strong>Object Writer</strong>. Check the box acknowledging the warning.</li>
<li>Click <strong>Save changes</strong>.</li>
</ol>

## Getting the AWS Access and Secret Keys for GitHub Action deployment
<ol>
<li>Select the IAM user that was just created from the list of users</li>
<li>Click <strong>Security Credentials</strong></li>
<li>Scroll down to find <strong>Access Keys</strong></li>
<li>Click <strong>Create access key</strong></li>
<li>Select <strong>Command Line Interface (CLI)</strong></li>
<li>Scroll down and tick the "I understand..." check box and click "Next"</li>
<li>Copy and/or download the _Access Key ID_ and _Secret Access Key_ to use for deployment.</li>
</ol>


# GitHub Actions & GitHub Secrets

In the root of your app edit the following file

```.github/workflows/deploy.yaml```

When committed and pushed to the GitHub repo this will add an Action to the GitHub Actions for that repository.

For it to work, 'secrets' also need to be created for the repository – these are environment variables used to replace ```${{secrets.DOCKER\_USERNAME}}```, for example, when the Action is run, using the .yaml file.

Secrets are scoped to the individual repository and may be safely used in public repositories as they remain secret. If they are forgotten it is not possible to retrieve them, they need to be destroyed and recreated.

You will need to add the following secrets (NB: keep the format as typed below so they work with the existing):

- DOCKER\_USERNAME
- DOCKER\_PASSWORD
- AWS\_ACCESS\_KEY
- AWS\_SECRET\_KEY

You will also need the following information, from the AWS step above:

- application\_name
- environment\_name
- existing\_bucket
- region

For example:

```yaml
    deploy-to-aws:
    name: deploy-aws
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: zip -r deploy.zip . -x '*.git*'
      - uses: einaregilsson/beanstalk-deploy@v18
        with:
          aws_access_key: '${{ secrets.AWS_ACCESS_KEY }}'
          aws_secret_key: '${{ secrets.AWS_SECRET_KEY }}'
          application_name: mern-beanstalk
          environment_name: Mern-beanstalk-env
          existing_bucket_name: elasticbeanstalk-eu-west-2-318746526342
          region: eu-west-2
          version_label: '${{ github.sha }}'
          deployment_package: deploy.zip
```


In addition it is best practice to replace "dockeruser" in the lines beginning
```yaml 
      - run: docker build -t mrclapham/mern-client ./client
```
with your own docker usename, eg:
```yaml 
      - run: docker build -t my-docker-username/mern-client ./client
```

Make some changes to your code and push or merge with 'main'. 

Assuming all tests pass it will build and deploy a new version of the app.




 

