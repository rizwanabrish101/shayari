package com.shayari.vista.ui.favorites

import androidx.lifecycle.LiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.asLiveData
import com.shayari.vista.data.model.Shayari
import com.shayari.vista.data.repository.ShayariRepository

class FavoritesViewModel(private val repository: ShayariRepository) : ViewModel() {

    val favoriteShayaris: LiveData<List<Shayari>> = repository.getAllFavorites().asLiveData()
}
