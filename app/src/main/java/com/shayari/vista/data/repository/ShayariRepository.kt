package com.shayari.vista.data.repository

import com.shayari.vista.data.local.FavoriteDao
import com.shayari.vista.data.model.Favorite
import com.shayari.vista.data.model.Shayari
import com.shayari.vista.data.remote.ApiService
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flatMapConcat
import kotlinx.coroutines.flow.flow

class ShayariRepository(
    private val apiService: ApiService,
    private val favoriteDao: FavoriteDao
) {

    // API methods
    suspend fun getPoets() = apiService.getPoets()
    suspend fun getPoet(id: String) = apiService.getPoet(id)
    suspend fun getCategories() = apiService.getCategories()
    suspend fun getShayaris(poetId: String? = null, categoryId: String? = null, query: String? = null) = apiService.getShayaris(poetId, categoryId, query)
    suspend fun getFeaturedShayari() = apiService.getFeaturedShayari()
    suspend fun getShayari(id: String) = apiService.getShayari(id)

    // Database methods
    fun getAllFavorites(): Flow<List<Shayari>> {
        return favoriteDao.getAllFavorites().flatMapConcat { favorites ->
            flow {
                val shayariList = favorites.mapNotNull { favorite ->
                    try {
                        apiService.getShayari(favorite.shayariId)
                    } catch (e: Exception) {
                        null
                    }
                }
                emit(shayariList)
            }
        }
    }
    suspend fun addFavorite(shayariId: String) = favoriteDao.addFavorite(Favorite(shayariId))
    suspend fun removeFavorite(shayariId: String) = favoriteDao.removeFavorite(shayariId)
    fun isFavorite(shayariId: String) = favoriteDao.isFavorite(shayariId)
}
