package com.shayari.vista.ui.search

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.asLiveData
import androidx.lifecycle.viewModelScope
import com.shayari.vista.data.model.Shayari
import com.shayari.vista.data.repository.ShayariRepository
import kotlinx.coroutines.launch

class SearchViewModel(private val repository: ShayariRepository) : ViewModel() {

    private val _searchResults = MutableLiveData<List<Shayari>>()
    val searchResults: LiveData<List<Shayari>> = _searchResults

    val favorites = repository.getAllFavorites().asLiveData()

    fun search(query: String) {
        viewModelScope.launch {
            try {
                val results = repository.getShayaris(query = query)
                _searchResults.postValue(results)
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
