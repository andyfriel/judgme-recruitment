Rails.application.routes.draw do
  resources :reviews, only: [:index, :create] do
  end
end
