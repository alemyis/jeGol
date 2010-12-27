require 'test_helper'

class GoalTest < ActiveSupport::TestCase
  def test_should_be_valid
    assert Goal.new.valid?
  end
end
