package com.shayari.vista.data.local

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.shayari.vista.data.model.Favorite
import kotlinx.coroutines.flow.Flow

@Dao
interface FavoriteDao {

    @Query("SELECT * FROM favorites")
    fun getAllFavorites(): Flow<List<Favorite>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun addFavorite(favorite: Favorite)

    @Query("DELETE FROM favorites WHERE shayariId = :shayariId")
    suspend fun removeFavorite(shayariId: String)

    @Query("SELECT EXISTS(SELECT 1 FROM favorites WHERE shayariId = :shayariId)")
    fun isFavorite(shayariId: String): Flow<Boolean>
}
