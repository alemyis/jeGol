class CreateMeetings < ActiveRecord::Migration
  def self.up
    create_table :meetings do |t|
      t.string :topic
      t.string :description
      t.string :location
      t.integer :duration
      t.datetime :start_at
      t.timestamps
    end
  end
  
  def self.down
    drop_table :meetings
  end
end
