require 'test_helper'

class AgendaTest < ActiveSupport::TestCase
  def test_should_be_valid
    assert Agenda.new.valid?
  end
end
