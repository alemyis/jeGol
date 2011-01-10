default_run_options[:pty] = true

# config vars
set :user, 'alemyis'
set :application, 'jeGol'
set :domain, 'jegol.achangeiscoming.net'
set :repository,  "git@github.com:#{user}/#{application}.git"
set :deploy_to, "/home/#{user}/#{domain}"
set :deploy_via, :remote_cache
set :scm, 'git'
set :branch, 'master'
set :git_shallow_clone, 1
set :scm_verbose, true
set :use_sudo, false

role :app, application
role :web, application
role :db,  application, :primary => true

namespace :deploy do
  task :restart do
    run "touch #{current_path}/tmp/restart.txt"
  end
  
  desc "Symlink shared configs and folders on each release."
  task :symlink_shared do
    run "ln -nfs #{shared_path}/config/database.yml #{release_path}/config/database.yml"
    run "ln -nfs #{shared_path}/config/jegol.yml #{release_path}/config/jegol.yml"
  end
end

after "deploy:update_code", "deploy:symlink_shared"
