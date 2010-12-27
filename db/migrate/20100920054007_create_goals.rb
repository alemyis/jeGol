class CreateGoals < ActiveRecord::Migration
  def self.up
    create_table :goals do |t|
      t.integer :meeting_id
      t.string :content
      t.timestamps
    end
  end
  
  def self.down
    drop_table :goals
  end
end
