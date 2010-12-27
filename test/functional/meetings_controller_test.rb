require 'test_helper'

class MeetingsControllerTest < ActionController::TestCase
  def test_index
    get :index
    assert_template 'index'
  end
  
  def test_show
    get :show, :id => Meeting.first
    assert_template 'show'
  end
  
  def test_new
    get :new
    assert_template 'new'
  end
  
  def test_create_invalid
    Meeting.any_instance.stubs(:valid?).returns(false)
    post :create
    assert_template 'new'
  end
  
  def test_create_valid
    Meeting.any_instance.stubs(:valid?).returns(true)
    post :create
    assert_redirected_to meeting_url(assigns(:meeting))
  end
  
  def test_edit
    get :edit, :id => Meeting.first
    assert_template 'edit'
  end
  
  def test_update_invalid
    Meeting.any_instance.stubs(:valid?).returns(false)
    put :update, :id => Meeting.first
    assert_template 'edit'
  end
  
  def test_update_valid
    Meeting.any_instance.stubs(:valid?).returns(true)
    put :update, :id => Meeting.first
    assert_redirected_to meeting_url(assigns(:meeting))
  end
  
  def test_destroy
    meeting = Meeting.first
    delete :destroy, :id => meeting
    assert_redirected_to meetings_url
    assert !Meeting.exists?(meeting.id)
  end
end
