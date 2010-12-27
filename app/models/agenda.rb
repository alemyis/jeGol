class Agenda < ActiveRecord::Base
  #attr_accessible :meeting_id, :content, :duration
  belongs_to :meeting
end
