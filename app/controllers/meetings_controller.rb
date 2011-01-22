require 'ruby_bosh'
require 'xmpp4r'
require 'xmpp4r/muc/helper/mucclient'
require 'xmpp4r/muc/helper/simplemucclient'

class MeetingsController < ApplicationController
  def index
    @meetings = Meeting.all
  end
  
  def show
    @meeting = Meeting.find(params[:id])
  end
  
  def embedable
    @meeting = Meeting.find(params[:id])
  end
  
  def new
    @meeting = Meeting.new
    #redirect_to '/meetings/topic'
  end
  
  def topic_get
    @meeting = nil 
    if params[:id].nil?
      @meeting = Meeting.new
    else
      @meeting = Meeting.find(params[:id])
    end
    
    respond_to do |format|
      format.html {render :template => "meetings/topic" }
    end
  end
  
  def topic_post
    @meeting = nil 
    if params[:id].nil?
      @meeting = Meeting.new(params[:meeting])
      if @meeting.save
        redirect_to meeting_goal_get_path(:id => @meeting.id)
      end
    else
      @meeting = Meeting.find(params[:id])
      if @meeting.update_attributes(params[:meeting])
        redirect_to meeting_goal_get_path(:id => @meeting.id)
      end
    end
  end
  
  def goal_get
    @meeting = Meeting.find(params[:id])
    if @meeting.goals.empty?
      1.times { @meeting.goals.build }
    end
    
    respond_to do |format|
      format.html {render :template => "meetings/goals" }
    end
  end
  
  def goal_post
    @meeting = Meeting.find(params[:id])
    if @meeting.update_attributes(params[:meeting])
      redirect_to meeting_agenda_get_path(:id => @meeting.id)
    end
  end
  
  def agenda_get
    @meeting = Meeting.find(params[:id])
    if @meeting.agendas.empty?
      1.times { @meeting.agendas.build }
    end
    respond_to do |format|
      format.html {render :template => "meetings/agendas" }
    end
  end
  
  def agenda_post
    @meeting = Meeting.find(params[:id])
    if @meeting.update_attributes(params[:meeting])
      redirect_to meeting_done_path(:id => @meeting.id)
    end
  end
  
  def done
    @meeting = Meeting.find(params[:id])
    respond_to do |format|
      format.html {render :template => "meetings/show" }
    end
  end
  
  def create
    @meeting = Meeting.new(params[:meeting])
    if @meeting.save
      if request.referer.include? "/topic"
        redirect_to :action => 'goal', :id => @meeting.id
      elsif request.referer.include? "/goals"
        redirect_to :action => 'agenda', :id => @meeting.id
      elsif request.referer.include? "/agendas"
        redirect_to @meeting
      else  
        flash[:notice] = "Successfully created meeting."
        redirect_to @meeting
      end
      
    else
      render :action => 'new'
    end
  end
  
  def edit
    @meeting = Meeting.find(params[:id])
  end
  
  def update
    @meeting = Meeting.find(params[:id])
    if @meeting.update_attributes(params[:meeting])
      if request.referer.include? "/topic"
        redirect_to :action => 'goal', :id => @meeting.id
      elsif request.referer.include? "/goals"
        redirect_to :action => 'agenda', :id => @meeting.id
      elsif request.referer.include? "/agendas"
        redirect_to @meeting
      else  
        flash[:notice] = "Successfully updated meeting."
        redirect_to @meeting
      end
    else
      render :action => 'edit'
    end
  end
  
  def destroy
    @meeting = Meeting.find(params[:id])
    @meeting.destroy
    flash[:notice] = "Successfully destroyed meeting."
    redirect_to meetings_url
  end
  
end