class Goal < ActiveRecord::Base
  #attr_accessible :meeting_id, :content
  belongs_to :meeting
end
