package com.shayari.vista.util

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import com.shayari.vista.data.repository.ShayariRepository
import com.shayari.vista.ui.favorites.FavoritesViewModel
import com.shayari.vista.ui.home.HomeViewModel
import com.shayari.vista.ui.poetdetail.PoetDetailViewModel
import com.shayari.vista.ui.search.SearchViewModel

class ViewModelFactory(private val repository: ShayariRepository) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(HomeViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return HomeViewModel(repository) as T
        }
        if (modelClass.isAssignableFrom(SearchViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return SearchViewModel(repository) as T
        }
        if (modelClass.isAssignableFrom(FavoritesViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return FavoritesViewModel(repository) as T
        }
        if (modelClass.isAssignableFrom(PoetDetailViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return PoetDetailViewModel(repository) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
