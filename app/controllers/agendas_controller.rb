class AgendasController < ApplicationController
  def index
    @agendas = Agenda.all
  end
  
  def show
    @agenda = Agenda.find(params[:id])
  end
  
  def new
    @agenda = Agenda.new
  end
    
  def create
    @agenda = Agenda.new(params[:agenda])
    if @agenda.save
      flash[:notice] = "Successfully created agenda."
      redirect_to @agenda
    else
      render :action => 'new'
    end
  end
  
  def edit
    @agenda = Agenda.find(params[:id])
  end
  
  def update
    @agenda = Agenda.find(params[:id])
    if @agenda.update_attributes(params[:agenda])
      flash[:notice] = "Successfully updated agenda."
      redirect_to @agenda
    else
      render :action => 'edit'
    end
  end
  
  def destroy
    @agenda = Agenda.find(params[:id])
    @agenda.destroy
    flash[:notice] = "Successfully destroyed agenda."
    redirect_to agendas_url
  end
end
