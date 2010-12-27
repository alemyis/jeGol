require 'test_helper'

class AgendasControllerTest < ActionController::TestCase
  def test_index
    get :index
    assert_template 'index'
  end
  
  def test_show
    get :show, :id => Agenda.first
    assert_template 'show'
  end
  
  def test_new
    get :new
    assert_template 'new'
  end
  
  def test_create_invalid
    Agenda.any_instance.stubs(:valid?).returns(false)
    post :create
    assert_template 'new'
  end
  
  def test_create_valid
    Agenda.any_instance.stubs(:valid?).returns(true)
    post :create
    assert_redirected_to agenda_url(assigns(:agenda))
  end
  
  def test_edit
    get :edit, :id => Agenda.first
    assert_template 'edit'
  end
  
  def test_update_invalid
    Agenda.any_instance.stubs(:valid?).returns(false)
    put :update, :id => Agenda.first
    assert_template 'edit'
  end
  
  def test_update_valid
    Agenda.any_instance.stubs(:valid?).returns(true)
    put :update, :id => Agenda.first
    assert_redirected_to agenda_url(assigns(:agenda))
  end
  
  def test_destroy
    agenda = Agenda.first
    delete :destroy, :id => agenda
    assert_redirected_to agendas_url
    assert !Agenda.exists?(agenda.id)
  end
end
