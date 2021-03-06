class UsersController < ApplicationController
  before_action :is_admin, only: [:index]
  before_action :set_user, only: [:show, :edit, :update, :destroy]
  
  # GET /users
  # GET /users.json
  def index
    @users = User.all.paginate(:page => params[:page], :per_page => 15)
  end
  
  # GET /users/1
  # GET /users/1.json
  def show
    if current_user.isadmin?
      @users = User.all
    else
      redirect_to root_url
    end
  end
  
  # GET /users/1/edit
  def edit
  end
  
  # PATCH/PUT /users/1
  # PATCH/PUT /users/1.json
  def update
    respond_to do |format|
      if @user.update(user_params)
        format.html { redirect_to users_path, notice: 'User was successfully updated.' }
        format.json { render :show, status: :ok, location: @user }
      else
        format.html { render :edit }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end
  
  # DELETE /users/1
  # DELETE /users/1.json
  def destroy
    @user.destroy
    respond_to do |format|
      format.html { redirect_to users_path, notice: 'User was successfully destroyed.' }
      format.json { head :no_content }
    end
  end
  
  private
    def set_user
      @user = User.find(params[:id])
    end
    
    def user_params
        params.require(:user).permit(:name, :email, :isadmin)
    end
    
    def is_admin
      if current_user && !current_user.isadmin
        redirect_to root_url
      end
    end
end