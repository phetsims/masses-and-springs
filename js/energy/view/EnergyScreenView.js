// Copyright 2017-2018, University of Colorado Boulder

/**
 * Spring view used for the energy screen.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var GravityAndDampingControlPanel = require( 'MASSES_AND_SPRINGS/common/view/GravityAndDampingControlPanel' );
  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var Panel = require( 'SUN/Panel' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var OneSpringView = require( 'MASSES_AND_SPRINGS/common/view/OneSpringView' );

  /**
   * @param {MassesAndSpringsModel} model
   * @param {Tandem} tandem
   *
   * @constructor
   */
  function EnergyScreenView( model, tandem ) {

    // Calls common spring view
    OneSpringView.call( this, model, tandem );
    var self = this;

    // Gravity Control Panel
    var gravityAndDampingControlPanel = new GravityAndDampingControlPanel(
      model, this, tandem.createTandem( 'gravityAndDampingControlPanel' ),
      {
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH,
        xMargin: 0,
        yMargin: 0,
        stroke: null,
        dampingVisible: true,
        hSlider: true
      }
    );

    // VBox that contains all of the panel's content
    var optionsVBox = new VBox( {
      spacing: 10,
      children: [
        this.referenceLinePanel,
        MassesAndSpringsConstants.LINE_SEPARATOR(),
        gravityAndDampingControlPanel
      ]
    } );

    // Panel that will display all the toggleable options.
    var optionsPanel = new Panel(
      optionsVBox,
      {
        xMargin: 10,
        fill: MassesAndSpringsConstants.PANEL_FILL,
        cornerRadius: MassesAndSpringsConstants.PANEL_CORNER_RADIUS,
        tandem: tandem.createTandem( 'ReferenceLinePanel' ),
        minWidth: MassesAndSpringsConstants.PANEL_MIN_WIDTH
      } );

    this.addChild( optionsPanel );
    optionsPanel.moveToBack();

    this.visibleBoundsProperty.link( function( visibleBounds ) {
      optionsPanel.top = self.energyGraphNode.top;
      optionsPanel.right = self.panelRightSpacing;
      self.toolboxPanel.top = optionsPanel.bottom + MassesAndSpringsConstants.PANEL_VERTICAL_SPACING;
      self.toolboxPanel.right = self.panelRightSpacing;
    } );
  }

  massesAndSprings.register( 'EnergyScreenView', EnergyScreenView );

  return inherit( OneSpringView, EnergyScreenView );
} );