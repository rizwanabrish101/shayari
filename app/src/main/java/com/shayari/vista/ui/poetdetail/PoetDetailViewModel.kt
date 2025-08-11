package com.shayari.vista.ui.poetdetail

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.asLiveData
import androidx.lifecycle.viewModelScope
import com.shayari.vista.data.model.Poet
import com.shayari.vista.data.model.Shayari
import com.shayari.vista.data.repository.ShayariRepository
import kotlinx.coroutines.launch

class PoetDetailViewModel(private val repository: ShayariRepository) : ViewModel() {

    private val _poet = MutableLiveData<Poet>()
    val poet: LiveData<Poet> = _poet

    private val _shayaris = MutableLiveData<List<Shayari>>()
    val shayaris: LiveData<List<Shayari>> = _shayaris

    val favorites = repository.getAllFavorites().asLiveData()

    fun fetchPoetDetails(poetId: String) {
        viewModelScope.launch {
            try {
                val poetResult = repository.getPoet(poetId)
                _poet.postValue(poetResult)

                val shayarisResult = repository.getShayaris(poetId = poetId)
                _shayaris.postValue(shayarisResult)
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
