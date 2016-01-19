// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var SystemNode = require( 'MASSES_AND_SPRINGS/masses-and-springs/view/SystemNode')

  var ImageMassNode = require( 'BALANCING_ACT/common/view/ImageMassNode' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Vector2 = require( 'DOT/Vector2' );
  var FireExtinguisher = require( 'BALANCING_ACT/common/model/masses/FireExtinguisher' );

  /**
   * @param {MassesAndSpringsModel} massesAndSpringsModel
   * @constructor
   */
  function MassesAndSpringsScreenView( model ) {

    ScreenView.call( this );

    var thisScreen = this;
    // Create the model-view transform.  The primary units used in the model
    // are meters, so significant zoom is used.  The multipliers for the 2nd
    // parameter can be used to adjust where the point (0, 0) in the model,
    // which is on the ground just below the center of the balance, is located
    // in the view.
    var mvt = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      new Vector2( thisScreen.layoutBounds.width * 0.375, thisScreen.layoutBounds.height * 0.79 ),
      105 );
    thisScreen.mvt = mvt; // Make mvt available to descendant types.

    this.addChild( new ImageMassNode(new FireExtinguisher( new Vector2( 5, 0), false ), thisScreen.mvt, false, null, true ) );

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
      },
      right:  this.layoutBounds.maxX - 10,
      bottom: this.layoutBounds.maxY - 10
    } );
    this.addChild( resetAllButton );

    //this.addChild( new SystemNode( model.system1, {
    //  unitDisplacementLength: 8,
    //  left: this.layoutBounds.left + 15,
    //  centerY: 0.25 * this.layoutBounds.height
    //} ) );

    this.addChild( new SystemNode( model.system, {
      unitDisplacementLength: 250,
      left: this.layoutBounds.left + 309,
      centerY: 0.5 * this.layoutBounds.height
    } ) );

  }

  massesAndSprings.register( 'MassesAndSpringsScreenView', MassesAndSpringsScreenView );

  return inherit( ScreenView, MassesAndSpringsScreenView, {


    ////TODO Called by the animation loop. Optional, so if your view has no animation, please delete this.
    //// @public
    //step: function( dt ) {
    //  //TODO Handle view animation here.
    //}
  } );
} );