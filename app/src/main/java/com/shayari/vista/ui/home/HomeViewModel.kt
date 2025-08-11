package com.shayari.vista.ui.home

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.asLiveData
import androidx.lifecycle.viewModelScope
import com.shayari.vista.data.model.Shayari
import com.shayari.vista.data.repository.ShayariRepository
import kotlinx.coroutines.launch

class HomeViewModel(private val repository: ShayariRepository) : ViewModel() {

    private val _shayaris = MutableLiveData<List<Shayari>>()
    val shayaris: LiveData<List<Shayari>> = _shayaris

    val favorites = repository.getAllFavorites().asLiveData()

    init {
        fetchShayaris()
    }

    private fun fetchShayaris() {
        viewModelScope.launch {
            try {
                val result = repository.getShayaris()
                _shayaris.postValue(result)
            } catch (e: Exception) {
                // Handle error
            }
        }
    }

    fun addFavorite(shayari: Shayari) {
        viewModelScope.launch {
            repository.addFavorite(shayari.id)
        }
    }

    fun removeFavorite(shayari: Shayari) {
        viewModelScope.launch {
            repository.removeFavorite(shayari.id)
        }
    }
}
