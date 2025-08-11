package com.shayari.vista.data.remote

import com.shayari.vista.data.model.Category
import com.shayari.vista.data.model.Poet
import com.shayari.vista.data.model.Shayari
import retrofit2.http.GET
import retrofit2.http.Path
import retrofit2.http.Query

interface ApiService {

    @GET("api/poets")
    suspend fun getPoets(): List<Poet>

    @GET("api/poets/{id}")
    suspend fun getPoet(@Path("id") id: String): Poet

    @GET("api/categories")
    suspend fun getCategories(): List<Category>

    @GET("api/shayaris")
    suspend fun getShayaris(
        @Query("poet") poetId: String? = null,
        @Query("category") categoryId: String? = null,
        @Query("search") query: String? = null
    ): List<Shayari>

    @GET("api/shayaris/featured")
    suspend fun getFeaturedShayari(): Shayari

    @GET("api/shayaris/{id}")
    suspend fun getShayari(@Path("id") id: String): Shayari
}
