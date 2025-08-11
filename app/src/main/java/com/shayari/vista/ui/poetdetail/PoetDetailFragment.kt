package com.shayari.vista.ui.poetdetail

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.fragment.navArgs
import androidx.recyclerview.widget.LinearLayoutManager
import coil.load
import com.shayari.vista.data.local.AppDatabase
import com.shayari.vista.data.remote.RetrofitClient
import com.shayari.vista.data.repository.ShayariRepository
import com.shayari.vista.databinding.FragmentPoetDetailBinding
import com.shayari.vista.ui.home.ShayariAdapter
import com.shayari.vista.util.ViewModelFactory

class PoetDetailFragment : Fragment() {

    private var _binding: FragmentPoetDetailBinding? = null
    private val binding get() = _binding!!

    private lateinit var viewModel: PoetDetailViewModel
    private lateinit var shayariAdapter: ShayariAdapter
    private val args: PoetDetailFragmentArgs by navArgs()

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentPoetDetailBinding.inflate(inflater, container, false)
        val view = binding.root

        // Setup RecyclerView
        shayariAdapter = ShayariAdapter(emptyList(),
            onItemClicked = {
                // Already on the detail screen, do nothing.
            },
            onFavoriteClicked = { shayari, isFavorite ->
                if (isFavorite) {
                    viewModel.removeFavorite(shayari)
                } else {
                    viewModel.addFavorite(shayari)
                }
            }
        )
        binding.recyclerViewPoetShayaris.apply {
            layoutManager = LinearLayoutManager(context)
            adapter = shayariAdapter
        }

        // Setup ViewModel
        val repository = ShayariRepository(
            RetrofitClient.apiService,
            AppDatabase.getDatabase(requireContext()).favoriteDao()
        )
        val factory = ViewModelFactory(repository)
        viewModel = ViewModelProvider(this, factory).get(PoetDetailViewModel::class.java)

        // Fetch data
        viewModel.fetchPoetDetails(args.poetId)

        // Observe LiveData
        viewModel.poet.observe(viewLifecycleOwner) { poet ->
            binding.poetName.text = poet.name
            binding.poetBio.text = poet.biography
            binding.poetImage.load(poet.imageUrl) {
                crossfade(true)
            }
        }

        viewModel.shayaris.observe(viewLifecycleOwner) { shayaris ->
            shayariAdapter.updateData(shayaris)
        }

        viewModel.favorites.observe(viewLifecycleOwner) { favorites ->
            shayariAdapter.setFavorites(favorites.map { it.id }.toSet())
        }

        return view
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
