package com.shayari.vista.data.model

data class Poet(
    val id: String,
    val name: String,
    val urduName: String,
    val title: String,
    val urduTitle: String,
    val birthYear: Int,
    val deathYear: Int?,
    val biography: String,
    val urduBiography: String,
    val imageUrl: String?
)
