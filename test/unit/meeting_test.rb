require 'test_helper'

class MeetingTest < ActiveSupport::TestCase
  def test_should_be_valid
    assert Meeting.new.valid?
  end
end
