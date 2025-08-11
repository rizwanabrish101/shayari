package com.shayari.vista.ui.home

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.shayari.vista.R
import com.shayari.vista.data.model.Shayari

class ShayariAdapter(
    private var shayaris: List<Shayari>,
    private val onItemClicked: (Shayari) -> Unit,
    private val onFavoriteClicked: (Shayari, Boolean) -> Unit
) : RecyclerView.Adapter<ShayariAdapter.ShayariViewHolder>() {

    private var favoriteIds = setOf<String>()

    fun setFavorites(favoriteIds: Set<String>) {
        this.favoriteIds = favoriteIds
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ShayariViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_shayari, parent, false)
        return ShayariViewHolder(view)
    }

    override fun onBindViewHolder(holder: ShayariViewHolder, position: Int) {
        val shayari = shayaris[position]
        holder.shayariText.text = shayari.text
        holder.poetName.text = shayari.poet.name
        holder.itemView.setOnClickListener {
            onItemClicked(shayari)
        }

        val isFavorite = favoriteIds.contains(shayari.id)
        holder.favoriteButton.setImageResource(
            if (isFavorite) android.R.drawable.btn_star_big_on
            else android.R.drawable.btn_star_big_off
        )

        holder.favoriteButton.setOnClickListener {
            onFavoriteClicked(shayari, isFavorite)
        }
    }

    override fun getItemCount() = shayaris.size

    fun updateData(newShayaris: List<Shayari>) {
        shayaris = newShayaris
        notifyDataSetChanged()
    }

    class ShayariViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val shayariText: TextView = itemView.findViewById(R.id.shayari_text)
        val poetName: TextView = itemView.findViewById(R.id.poet_name)
        val favoriteButton: ImageButton = itemView.findViewById(R.id.favorite_button)
    }
}
