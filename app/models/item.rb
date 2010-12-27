class Item < ActiveRecord::Base
  #attr_accessible :meeting_id, :content, :type
  
  belongs_to :meeting
end
