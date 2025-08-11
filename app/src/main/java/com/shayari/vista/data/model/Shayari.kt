package com.shayari.vista.data.model

data class Shayari(
    val id: String,
    val poetId: String,
    val categoryId: String,
    val text: String,
    val transliteration: String?,
    val translation: String?,
    val isFeatured: Boolean,
    val poet: Poet,
    val category: Category
)
