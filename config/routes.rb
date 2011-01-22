JeGol::Application.routes.draw do
  match '/' => 'meetings#index'
  match '/home' => 'meetings#index'
  
  #map.meeting_topic_new 'meetings/topic', :conditions => { :method => :get  }, :controller => 'meetings', :action => 'topic_get'
  match '/meetings/topic' => 'meetings#topic_get', :conditions => { :method => :get  }
  #map.meeting_topic_new 'meetings/topic', :conditions => { :method => :get  }, :controller => 'meetings', :action => 'topic_get'
  match '/meetings/:id/topic' => 'meetings#topic_get', :conditions => { :method => :get  }
  #map.meeting_topic_new 'meetings/topic', :conditions => { :method => :get  }, :controller => 'meetings', :action => 'topic_get'
  match '/meetings/topic' => 'meetings#topic_post', :conditions => { :method => :post  }
  #map.meeting_topic_new 'meetings/topic', :conditions => { :method => :get  }, :controller => 'meetings', :action => 'topic_get'
  match '/meetings/:id/topic' => 'meetings#topic_post', :conditions => { :method => :post  }
  #map.meeting_topic_new 'meetings/topic', :conditions => { :method => :get  }, :controller => 'meetings', :action => 'topic_get'
  match '/meetings/topic' => 'meetings#topic_post', :conditions => { :method => :post  }
  #map.meeting_topic_new_post 'meetings/topic', :conditions => { :method => :post  }, :controller => 'meetings', :action => 'topic_post'
  match '/meetings/:id/topic' => 'meetings#topic_post', :conditions => { :method => :post }
  #map.meeting_topic_get 'meetings/:id/topic', :conditions => { :method => :get  }, :controller => 'meetings', :action => 'topic_get'
  match '/meetings/:id/topic' => 'meetings#topic_get', :conditions => {:method => :get}
  #map.meeting_topic_post 'meetings/:id/topic', :conditions => { :method => :post }, :controller => 'meetings', :action => 'topic_post'
  #
  #map.meeting_goal_get 'meetings/:id/goals', :conditions => { :method => :get  }, :controller => 'meetings', :action => 'goal_get'
  match 'meetings/:id/goals' => 'meetings#goal_get', :conditions => { :method => :get }
  #map.meeting_goal_post 'meetings/:id/goals', :conditions => { :method => :post }, :controller => 'meetings', :action => 'goal_post'
  match 'meetings/:id/goals' => 'meetings#goal_post', :conditions => { :method => :post }
  #
  #map.meeting_agenda_get 'meetings/:id/agendas', :conditions => { :method => :get  }, :controller => 'meetings', :action => 'agenda_get'
  match 'meetings/:id/agendas' => 'meetings#agenda_get', :conditions => { :method => :get }
  #map.meeting_agenda_post 'meetings/:id/agendas', :conditions => { :method => :post }, :controller => 'meetings', :action => 'agenda_post'
  match 'meetings/:id/agendas' => 'meetings#agenda_post', :conditions => { :method => :post }
  #  
  #map.meeting_done 'meetings/:id/done', :conditions => { :method => :get  }, :controller => 'meetings', :action => 'done'
  match 'meetings/:id/done' => 'meetings#done', :conditions => { :method => :get  }
  
  #map.bosh_session '/jegol/boshsession/:room_jid', :conditions => {:method => :get }, :controller => 'jegol', :action => 'new_boshsession'
  match 'jegol/boshsession/:room_jid' => 'jegol#new_boshsession', :conditions => {:method => :get }
  
  resources :meetings do
    member do
      get 'embedable'
      post 'embedable'
    end
  end
  
  resources :meetings
  
  #map.home '', :controller => 'meetings', :action => 'index'
  
  #resources :photos, :as => "images"
  #
  #match '/home' => 'meetings#index'
  ##resources :as => 'home', :controller => 'meetings', :action => 'index'
  #
  #match '/meetings/topic' => 'meetings#topic_get' 
  #resources :as => 'meeting_topic_new', :path => 'meetings/topic', :conditions => { :method => :get  }, :controller => 'meetings', :action => 'topic_get'
  #
  ##map.meeting_topic_new 'meetings/topic', :conditions => { :method => :get  }, :controller => 'meetings', :action => 'topic_get'
  #
  #resources :as => 'meeting_topic_new_post', :path => 'meetings/topic', :conditions => { :method => :post  }, :controller => 'meetings', :action => 'topic_post'
  ##map.meeting_topic_new_post 'meetings/topic', :conditions => { :method => :post  }, :controller => 'meetings', :action => 'topic_post'
  #
  #resources :as => 'meeting_topic_get', :path => 'meetings/:id/topic', :conditions => { :method => :get  }, :controller => 'meetings', :action => 'topic_get'
  ##map.meeting_topic_get 'meetings/:id/topic', :conditions => { :method => :get  }, :controller => 'meetings', :action => 'topic_get'
  #
  #resources :as => 'meeting_topic_post', :path => 'meetings/:id/topic', :conditions => { :method => :post }, :controller => 'meetings', :action => 'topic_post'
  ##map.meeting_topic_post 'meetings/:id/topic', :conditions => { :method => :post }, :controller => 'meetings', :action => 'topic_post'
  #
  #resources :as => 'meeting_goal_get', :path => 'meetings/:id/goals', :conditions => { :method => :get  }, :controller => 'meetings', :action => 'goal_get'
  ##map.meeting_goal_get 'meetings/:id/goals', :conditions => { :method => :get  }, :controller => 'meetings', :action => 'goal_get'
  #
  #resources :as => 'meeting_goal_post', :path => 'meetings/:id/goals', :conditions => { :method => :post }, :controller => 'meetings', :action => 'goal_post'
  ##map.meeting_goal_post 'meetings/:id/goals', :conditions => { :method => :post }, :controller => 'meetings', :action => 'goal_post'
  #
  #resources :as => 'meeting_agenda_get', :path => 'meetings/:id/agendas', :conditions => { :method => :get  }, :controller => 'meetings', :action => 'agenda_get'
  ##map.meeting_agenda_get 'meetings/:id/agendas', :conditions => { :method => :get  }, :controller => 'meetings', :action => 'agenda_get'
  #
  #resources :as => 'meeting_agenda_post', :path => 'meetings/:id/agendas', :conditions => { :method => :post }, :controller => 'meetings', :action => 'agenda_post' 
  ##map.meeting_agenda_post 'meetings/:id/agendas', :conditions => { :method => :post }, :controller => 'meetings', :action => 'agenda_post'
  #  
  #resources :as => 'meeting_done', :path => 'meetings/:id/done', :conditions => { :method => :get  }, :controller => 'meetings', :action => 'done'
  ##map.meeting_done 'meetings/:id/done', :conditions => { :method => :get  }, :controller => 'meetings', :action => 'done'
  #
  #resources :as => 'bosh_session', :path => '/jegol/boshsession/:room_jid', :conditions => {:method => :get }, :controller => 'jegol', :action => 'new_boshsession'
  ##map.bosh_session '/jegol/boshsession/:room_jid', :conditions => {:method => :get }, :controller => 'jegol', :action => 'new_boshsession'
  #
  #resources :meetings
end
