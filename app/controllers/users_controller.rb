class UsersController < ApplicationController
    private
    def set_user
      @user = User.find(params[:id])
    end

    def user_params
        params.require(:user).permit(:name, :email, :admin)
    end
    
    def is_admin
      if !current_user.admin
        redirect_to root_url
      end
    end
end