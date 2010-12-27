class CreateItems < ActiveRecord::Migration
  def self.up
    create_table :items do |t|
      t.integer :meeting_id
      t.string :content
      t.timestamps
    end
  end
  
  def self.down
    drop_table :items
  end
end
